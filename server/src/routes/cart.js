import { Router } from 'express'
import { randomUUID } from 'node:crypto'
import { db } from '../db/connection.js'
import { optionalAuth } from '../middleware/auth.js'
import { formatTry, mapProduct } from '../utils/money.js'

const router = Router()

function getOrCreateCart(req, res) {
  if (req.user) {
    let cart = db.prepare('SELECT * FROM carts WHERE user_id = ?').get(req.user.id)
    if (!cart) {
      const result = db.prepare('INSERT INTO carts (user_id) VALUES (?)').run(req.user.id)
      cart = db.prepare('SELECT * FROM carts WHERE id = ?').get(result.lastInsertRowid)
    }
    return cart
  }

  let guestToken = req.headers['x-guest-token'] || req.cookies?.guest_token
  if (!guestToken) {
    guestToken = randomUUID()
    res.setHeader('X-Guest-Token', guestToken)
  }
  let cart = db.prepare('SELECT * FROM carts WHERE guest_token = ?').get(guestToken)
  if (!cart) {
    const result = db.prepare('INSERT INTO carts (guest_token) VALUES (?)').run(guestToken)
    cart = db.prepare('SELECT * FROM carts WHERE id = ?').get(result.lastInsertRowid)
  }
  return { ...cart, guestToken }
}

function cartPayload(cartId) {
  const rows = db
    .prepare(
      `SELECT ci.id, ci.quantity, ci.variant_id AS variantId,
              v.color, v.size, v.stock,
              p.id AS product_id, p.sku, p.slug, p.name, p.brand_id, p.category_id, p.sport_id,
              p.description, p.price_kurus, p.compare_at_kurus, p.rating, p.review_count,
              p.gender, p.is_new, p.is_deal, p.free_store_pickup, p.image_url,
              b.name AS brand_name, b.slug AS brand_slug,
              c.name AS category_name, c.slug AS category_slug,
              s.name AS sport_name, s.slug AS sport_slug
       FROM cart_items ci
       JOIN product_variants v ON v.id = ci.variant_id
       JOIN products p ON p.id = v.product_id
       JOIN brands b ON b.id = p.brand_id
       JOIN categories c ON c.id = p.category_id
       LEFT JOIN sports s ON s.id = p.sport_id
       WHERE ci.cart_id = ?`
    )
    .all(cartId)

  const items = rows.map((row) => {
    const product = mapProduct(row)
    return {
      id: row.id,
      variantId: row.variantId,
      quantity: row.quantity,
      color: row.color,
      size: row.size,
      stock: row.stock,
      lineTotalKurus: product.priceKurus * row.quantity,
      lineTotalLabel: formatTry(product.priceKurus * row.quantity),
      product,
    }
  })

  const subtotalKurus = items.reduce((sum, i) => sum + i.lineTotalKurus, 0)
  return {
    items,
    itemCount: items.reduce((sum, i) => sum + i.quantity, 0),
    subtotalKurus,
    subtotalLabel: formatTry(subtotalKurus),
  }
}

router.use(optionalAuth)

router.get('/', (req, res) => {
  const cart = getOrCreateCart(req, res)
  const payload = cartPayload(cart.id)
  if (cart.guestToken) payload.guestToken = cart.guestToken
  res.json(payload)
})

router.post('/items', (req, res) => {
  const cart = getOrCreateCart(req, res)
  const { variantId, quantity = 1 } = req.body || {}
  const variant = db.prepare('SELECT * FROM product_variants WHERE id = ?').get(variantId)
  if (!variant) return res.status(404).json({ error: 'Varyant bulunamadı.' })
  if (variant.stock < 1) return res.status(400).json({ error: 'Stokta yok.' })

  const existing = db
    .prepare('SELECT * FROM cart_items WHERE cart_id = ? AND variant_id = ?')
    .get(cart.id, variantId)

  const nextQty = (existing?.quantity || 0) + Number(quantity)
  if (nextQty > variant.stock) {
    return res.status(400).json({ error: 'Yetersiz stok.' })
  }

  if (existing) {
    db.prepare('UPDATE cart_items SET quantity = ? WHERE id = ?').run(nextQty, existing.id)
  } else {
    db.prepare('INSERT INTO cart_items (cart_id, variant_id, quantity) VALUES (?, ?, ?)').run(
      cart.id,
      variantId,
      Number(quantity)
    )
  }
  db.prepare(`UPDATE carts SET updated_at = datetime('now') WHERE id = ?`).run(cart.id)

  const payload = cartPayload(cart.id)
  if (cart.guestToken) payload.guestToken = cart.guestToken
  res.status(201).json(payload)
})

router.patch('/items/:id', (req, res) => {
  const cart = getOrCreateCart(req, res)
  const item = db
    .prepare('SELECT * FROM cart_items WHERE id = ? AND cart_id = ?')
    .get(req.params.id, cart.id)
  if (!item) return res.status(404).json({ error: 'Sepet kalemi bulunamadı.' })

  const quantity = Number(req.body?.quantity)
  if (!Number.isInteger(quantity) || quantity < 1) {
    return res.status(400).json({ error: 'Geçersiz adet.' })
  }
  const variant = db.prepare('SELECT * FROM product_variants WHERE id = ?').get(item.variant_id)
  if (quantity > variant.stock) return res.status(400).json({ error: 'Yetersiz stok.' })

  db.prepare('UPDATE cart_items SET quantity = ? WHERE id = ?').run(quantity, item.id)
  const payload = cartPayload(cart.id)
  if (cart.guestToken) payload.guestToken = cart.guestToken
  res.json(payload)
})

router.delete('/items/:id', (req, res) => {
  const cart = getOrCreateCart(req, res)
  db.prepare('DELETE FROM cart_items WHERE id = ? AND cart_id = ?').run(req.params.id, cart.id)
  const payload = cartPayload(cart.id)
  if (cart.guestToken) payload.guestToken = cart.guestToken
  res.json(payload)
})

export default router
