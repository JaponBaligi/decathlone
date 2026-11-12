import { Router } from 'express'
import { db } from '../db/connection.js'
import { requireAuth } from '../middleware/auth.js'

const router = Router()
router.use(requireAuth)

router.get('/addresses', (req, res) => {
  const rows = db
    .prepare('SELECT * FROM addresses WHERE user_id = ? ORDER BY is_default DESC, id DESC')
    .all(req.user.id)
    .map((a) => ({
      id: a.id,
      title: a.title,
      fullName: a.full_name,
      phone: a.phone,
      city: a.city,
      district: a.district,
      line1: a.line1,
      isDefault: Boolean(a.is_default),
    }))
  res.json(rows)
})

router.post('/addresses', (req, res) => {
  const { title, fullName, phone, city, district, line1, isDefault } = req.body || {}
  if (!title || !fullName || !phone || !city || !district || !line1) {
    return res.status(400).json({ error: 'Adres alanları eksik.' })
  }
  const tx = db.transaction(() => {
    if (isDefault) {
      db.prepare('UPDATE addresses SET is_default = 0 WHERE user_id = ?').run(req.user.id)
    }
    return db
      .prepare(
        `INSERT INTO addresses (user_id, title, full_name, phone, city, district, line1, is_default)
         VALUES (?, ?, ?, ?, ?, ?, ?, ?)`
      )
      .run(req.user.id, title, fullName, phone, city, district, line1, isDefault ? 1 : 0)
  })
  const result = tx()
  res.status(201).json({ id: result.lastInsertRowid })
})

router.delete('/addresses/:id', (req, res) => {
  db.prepare('DELETE FROM addresses WHERE id = ? AND user_id = ?').run(req.params.id, req.user.id)
  res.status(204).end()
})

export default router
