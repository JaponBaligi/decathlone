import { Router } from 'express'
import { db } from '../db/connection.js'
import { requireAuth } from '../middleware/auth.js'
import { mapProduct } from '../utils/money.js'

const router = Router()
const productSelect = `
  SELECT p.*,
    b.name AS brand_name, b.slug AS brand_slug,
    c.name AS category_name, c.slug AS category_slug,
    s.name AS sport_name, s.slug AS sport_slug
  FROM wishlists w
  JOIN products p ON p.id = w.product_id
  JOIN brands b ON b.id = p.brand_id
  JOIN categories c ON c.id = p.category_id
  LEFT JOIN sports s ON s.id = p.sport_id
  WHERE w.user_id = ?
  ORDER BY w.created_at DESC
`

router.use(requireAuth)

router.get('/', (req, res) => {
  const items = db.prepare(productSelect).all(req.user.id).map(mapProduct)
  res.json({ items })
})

router.post('/:productId', (req, res) => {
  const product = db.prepare('SELECT id FROM products WHERE id = ?').get(req.params.productId)
  if (!product) return res.status(404).json({ error: 'Ürün bulunamadı.' })
  db.prepare(
    `INSERT OR IGNORE INTO wishlists (user_id, product_id) VALUES (?, ?)`
  ).run(req.user.id, product.id)
  const items = db.prepare(productSelect).all(req.user.id).map(mapProduct)
  res.status(201).json({ items })
})

router.delete('/:productId', (req, res) => {
  db.prepare('DELETE FROM wishlists WHERE user_id = ? AND product_id = ?').run(
    req.user.id,
    req.params.productId
  )
  const items = db.prepare(productSelect).all(req.user.id).map(mapProduct)
  res.json({ items })
})

export default router
