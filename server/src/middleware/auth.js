import jwt from 'jsonwebtoken'
import { db } from '../db/connection.js'

const JWT_SECRET = process.env.JWT_SECRET || 'decathlon-clone-local-dev-secret'

export function signToken(user) {
  return jwt.sign({ sub: user.id, email: user.email }, JWT_SECRET, { expiresIn: '7d' })
}

export function optionalAuth(req, _res, next) {
  const header = req.headers.authorization
  if (!header?.startsWith('Bearer ')) {
    req.user = null
    return next()
  }
  try {
    const payload = jwt.verify(header.slice(7), JWT_SECRET)
    const user = db
      .prepare('SELECT id, email, first_name, last_name, phone FROM users WHERE id = ?')
      .get(payload.sub)
    req.user = user || null
  } catch {
    req.user = null
  }
  next()
}

export function requireAuth(req, res, next) {
  optionalAuth(req, res, () => {
    if (!req.user) {
      return res.status(401).json({ error: 'Giriş yapmanız gerekiyor.' })
    }
    next()
  })
}
