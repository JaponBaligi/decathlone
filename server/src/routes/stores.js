import { Router } from 'express'
import { db } from '../db/connection.js'

const router = Router()

function mapStore(row) {
  return {
    id: row.id,
    slug: row.slug,
    name: row.name,
    city: row.city,
    district: row.district,
    address: row.address,
    phone: row.phone,
    lat: row.lat,
    lng: row.lng,
    hours: row.hours,
    services: JSON.parse(row.services || '[]'),
  }
}

router.get('/', (req, res) => {
  const { city, q } = req.query
  const where = []
  const params = {}
  if (city) {
    where.push('city = @city')
    params.city = city
  }
  if (q) {
    where.push('(name LIKE @q OR district LIKE @q OR address LIKE @q)')
    params.q = `%${q}%`
  }
  const sql = `SELECT * FROM stores ${where.length ? 'WHERE ' + where.join(' AND ') : ''} ORDER BY city, name`
  res.json(db.prepare(sql).all(params).map(mapStore))
})

router.get('/cities', (_req, res) => {
  res.json(db.prepare('SELECT DISTINCT city FROM stores ORDER BY city').all().map((r) => r.city))
})

router.get('/:slug', (req, res) => {
  const row = db.prepare('SELECT * FROM stores WHERE slug = ?').get(req.params.slug)
  if (!row) return res.status(404).json({ error: 'Mağaza bulunamadı.' })
  res.json(mapStore(row))
})

export default router
