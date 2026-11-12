import { Router } from 'express'
import bcrypt from 'bcryptjs'
import { db } from '../db/connection.js'
import { requireAuth, signToken } from '../middleware/auth.js'

const router = Router()

function publicUser(row) {
  return {
    id: row.id,
    email: row.email,
    firstName: row.first_name,
    lastName: row.last_name,
    phone: row.phone,
  }
}

router.post('/register', (req, res) => {
  const { email, password, firstName, lastName, phone } = req.body || {}
  if (!email || !password || !firstName || !lastName) {
    return res.status(400).json({ error: 'Zorunlu alanlar eksik.' })
  }
  if (String(password).length < 6) {
    return res.status(400).json({ error: 'Şifre en az 6 karakter olmalı.' })
  }
  const existing = db.prepare('SELECT id FROM users WHERE email = ?').get(String(email).toLowerCase())
  if (existing) return res.status(409).json({ error: 'Bu e-posta zaten kayıtlı.' })

  const passwordHash = bcrypt.hashSync(password, 10)
  const result = db
    .prepare(
      `INSERT INTO users (email, password_hash, first_name, last_name, phone)
       VALUES (?, ?, ?, ?, ?)`
    )
    .run(String(email).toLowerCase(), passwordHash, firstName, lastName, phone || null)

  const user = db
    .prepare('SELECT id, email, first_name, last_name, phone FROM users WHERE id = ?')
    .get(result.lastInsertRowid)
  const token = signToken(user)
  res.status(201).json({ token, user: publicUser(user) })
})

router.post('/login', (req, res) => {
  const { email, password } = req.body || {}
  if (!email || !password) return res.status(400).json({ error: 'E-posta ve şifre gerekli.' })

  const user = db
    .prepare('SELECT * FROM users WHERE email = ?')
    .get(String(email).toLowerCase())
  if (!user || !bcrypt.compareSync(password, user.password_hash)) {
    return res.status(401).json({ error: 'E-posta veya şifre hatalı.' })
  }
  res.json({ token: signToken(user), user: publicUser(user) })
})

router.get('/me', requireAuth, (req, res) => {
  res.json({ user: publicUser(req.user) })
})

router.put('/me', requireAuth, (req, res) => {
  const { firstName, lastName, phone } = req.body || {}
  db.prepare(
    `UPDATE users SET first_name = COALESCE(?, first_name),
      last_name = COALESCE(?, last_name),
      phone = COALESCE(?, phone)
     WHERE id = ?`
  ).run(firstName || null, lastName || null, phone || null, req.user.id)

  const user = db
    .prepare('SELECT id, email, first_name, last_name, phone FROM users WHERE id = ?')
    .get(req.user.id)
  res.json({ user: publicUser(user) })
})

export default router
