import { Router } from 'express'
import { randomUUID } from 'node:crypto'
import { db } from '../db/connection.js'
import { optionalAuth, requireAuth } from '../middleware/auth.js'
import { formatTry } from '../utils/money.js'

const router = Router()

function getCartForRequest(req) {
  if (req.user) {
    return db.prepare('SELECT * FROM carts WHERE user_id = ?').get(req.user.id)
  }
  const guestToken = req.headers['x-guest-token']
  if (!guestToken) return null
  return db.prepare('SELECT * FROM carts WHERE guest_token = ?').get(guestToken)
}

router.post('/checkout', optionalAuth, (req, res) => {
  const cart = getCartForRequest(req)
  if (!cart) return res.status(400).json({ error: 'Sepet bulunamadı.' })

  const items = db
    .prepare(
      `SELECT ci.*, v.color, v.size, v.stock, v.product_id, p.name, p.price_kurus
       FROM cart_items ci
       JOIN product_variants v ON v.id = ci.variant_id
       JOIN products p ON p.id = v.product_id
       WHERE ci.cart_id = ?`
    )
    .all(cart.id)

  if (!items.length) return res.status(400).json({ error: 'Sepet boş.' })

  const { deliveryType = 'home', paymentMethod = 'card', address, storeId } = req.body || {}
  if (!['home', 'store'].includes(deliveryType)) {
    return res.status(400).json({ error: 'Geçersiz teslimat tipi.' })
  }
  if (deliveryType === 'store' && !storeId) {
    return res.status(400).json({ error: 'Mağaza seçimi gerekli.' })
  }
  if (deliveryType === 'home' && !address) {
    return res.status(400).json({ error: 'Adres gerekli.' })
  }

  for (const item of items) {
    if (item.quantity > item.stock) {
      return res.status(400).json({ error: `${item.name} için yetersiz stok.` })
    }
  }

  const subtotalKurus = items.reduce((sum, i) => sum + i.price_kurus * i.quantity, 0)
  const shippingKurus = deliveryType === 'home' ? (subtotalKurus >= 150000 ? 0 : 4990) : 0
  const totalKurus = subtotalKurus + shippingKurus
  const orderNumber = `DCT-${Date.now().toString(36).toUpperCase()}-${randomUUID().slice(0, 4).toUpperCase()}`

  const tx = db.transaction(() => {
    const order = db
      .prepare(
        `INSERT INTO orders (
          user_id, order_number, status, delivery_type, payment_method,
          subtotal_kurus, shipping_kurus, total_kurus, shipping_address_json, store_id
        ) VALUES (?, ?, 'confirmed', ?, ?, ?, ?, ?, ?, ?)`
      )
      .run(
        req.user?.id || null,
        orderNumber,
        deliveryType,
        paymentMethod,
        subtotalKurus,
        shippingKurus,
        totalKurus,
        address ? JSON.stringify(address) : null,
        storeId || null
      )

    const insertItem = db.prepare(
      `INSERT INTO order_items (
        order_id, product_id, variant_id, product_name, color, size, unit_price_kurus, quantity
      ) VALUES (?, ?, ?, ?, ?, ?, ?, ?)`
    )
    const decStock = db.prepare('UPDATE product_variants SET stock = stock - ? WHERE id = ? AND stock >= ?')

    for (const item of items) {
      insertItem.run(
        order.lastInsertRowid,
        item.product_id,
        item.variant_id,
        item.name,
        item.color,
        item.size,
        item.price_kurus,
        item.quantity
      )
      const stockResult = decStock.run(item.quantity, item.variant_id, item.quantity)
      if (stockResult.changes !== 1) {
        throw new Error('STOCK')
      }
    }

    db.prepare('DELETE FROM cart_items WHERE cart_id = ?').run(cart.id)
    return order.lastInsertRowid
  })

  let orderId
  try {
    orderId = tx()
  } catch (err) {
    if (err.message === 'STOCK') return res.status(409).json({ error: 'Stok yarışı: tekrar deneyin.' })
    throw err
  }

  const order = db.prepare('SELECT * FROM orders WHERE id = ?').get(orderId)
  res.status(201).json({
    id: order.id,
    orderNumber: order.order_number,
    status: order.status,
    deliveryType: order.delivery_type,
    paymentMethod: order.payment_method,
    subtotalLabel: formatTry(order.subtotal_kurus),
    shippingLabel: formatTry(order.shipping_kurus),
    totalLabel: formatTry(order.total_kurus),
    totalKurus: order.total_kurus,
    createdAt: order.created_at,
  })
})

router.get('/', requireAuth, (req, res) => {
  const orders = db
    .prepare(`SELECT * FROM orders WHERE user_id = ? ORDER BY id DESC`)
    .all(req.user.id)
    .map((o) => ({
      id: o.id,
      orderNumber: o.order_number,
      status: o.status,
      deliveryType: o.delivery_type,
      totalLabel: formatTry(o.total_kurus),
      createdAt: o.created_at,
    }))
  res.json(orders)
})

router.get('/:orderNumber', optionalAuth, (req, res) => {
  const order = db.prepare('SELECT * FROM orders WHERE order_number = ?').get(req.params.orderNumber)
  if (!order) return res.status(404).json({ error: 'Sipariş bulunamadı.' })
  if (order.user_id && req.user && order.user_id !== req.user.id) {
    return res.status(403).json({ error: 'Yetkisiz.' })
  }

  const items = db
    .prepare('SELECT * FROM order_items WHERE order_id = ?')
    .all(order.id)
    .map((i) => ({
      productName: i.product_name,
      color: i.color,
      size: i.size,
      quantity: i.quantity,
      unitPriceLabel: formatTry(i.unit_price_kurus),
      lineTotalLabel: formatTry(i.unit_price_kurus * i.quantity),
    }))

  res.json({
    id: order.id,
    orderNumber: order.order_number,
    status: order.status,
    deliveryType: order.delivery_type,
    paymentMethod: order.payment_method,
    subtotalLabel: formatTry(order.subtotal_kurus),
    shippingLabel: formatTry(order.shipping_kurus),
    totalLabel: formatTry(order.total_kurus),
    address: order.shipping_address_json ? JSON.parse(order.shipping_address_json) : null,
    storeId: order.store_id,
    createdAt: order.created_at,
    items,
  })
})

export default router
