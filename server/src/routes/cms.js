import { Router } from 'express'
import { db } from '../db/connection.js'

const router = Router()

router.get('/', (_req, res) => {
  const pages = db
    .prepare('SELECT slug, title, section FROM cms_pages ORDER BY section, title')
    .all()
  const grouped = {}
  for (const page of pages) {
    if (!grouped[page.section]) grouped[page.section] = []
    grouped[page.section].push({ slug: page.slug, title: page.title })
  }
  res.json(grouped)
})

router.get('/:slug', (req, res) => {
  const page = db
    .prepare('SELECT slug, title, body, section FROM cms_pages WHERE slug = ?')
    .get(req.params.slug)
  if (!page) return res.status(404).json({ error: 'Sayfa bulunamadı.' })
  res.json(page)
})

export default router
