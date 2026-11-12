import { readFileSync } from 'fs'
import { dirname, join } from 'path'
import { fileURLToPath } from 'url'
import { Router } from 'express'
import { db } from '../db/connection.js'
import { mapProduct } from '../utils/money.js'

const router = Router()
const dealsFacetsPath = join(dirname(fileURLToPath(import.meta.url)), '../db/deals-facets.json')
let dealsFacetsCache = null
function getDealsFacets() {
  if (!dealsFacetsCache) {
    dealsFacetsCache = JSON.parse(readFileSync(dealsFacetsPath, 'utf8'))
  }
  return dealsFacetsCache
}

const productSelect = `
  SELECT p.*,
    b.name AS brand_name, b.slug AS brand_slug,
    c.name AS category_name, c.slug AS category_slug,
    s.name AS sport_name, s.slug AS sport_slug
  FROM products p
  JOIN brands b ON b.id = p.brand_id
  JOIN categories c ON c.id = p.category_id
  LEFT JOIN sports s ON s.id = p.sport_id
`

/**
 * Collection PLP slug → keyword heuristics (OR of LIKE on name/description/brand).
 * Include both Turkish Title-Case and lowercase forms: SQLite LIKE is ASCII-case-insensitive only.
 */
const COLLECTION_KEYWORDS = {
  'kis-urunleri': ['mont', 'polar', 'İçlik', 'içlik', 'bot', 'kayak', 'bere', 'eldiven'],
  montlar: ['mont'],
  polarlar: ['polar'],
  iclikler: ['İçlik', 'içlik', 'termal'],
  'ic-giyim': ['İçlik', 'içlik', 'termal'],
  'su-gecirmezler': ['su geçirmez'],
  yagmurluklar: ['Yağmurluk', 'yağmurluk'],
  'su-gecirmez-ayakkabilar': ['kar bot', 'Çizme', 'çizme', 'su geçirmez bot', 'Su Geçirmez Bot', 'su geçirmez ayakkabı'],
  'evde-spor-aletleri': ['fitness', 'kettlebell', 'dambıl', 'halter', 'barbell', 'pilates', 'yoga', 'ağırlık'],
  'kosu-bantlari-eliptik-bisikletler': ['koşu band', 'eliptik'],
  cantalar: ['Çanta', 'çanta', 'backpack', 'bag'],
  coraplar: ['Çorap', 'çorap'],
  semsiyeler: ['Şemsiye', 'şemsiye'],
  'termos-ve-mataralar': ['termos', 'matara'],
}

function buildProductQuery(query) {
  const where = []
  const params = {}

  if (query.q) {
    where.push('(p.name LIKE @q OR p.description LIKE @q OR b.name LIKE @q)')
    params.q = `%${query.q}%`
  }
  if (query.collection) {
    const keywords = COLLECTION_KEYWORDS[String(query.collection)]
    if (keywords?.length) {
      const parts = keywords.map((term, i) => {
        const key = `coll${i}`
        params[key] = `%${term}%`
        return `(p.name LIKE @${key} OR p.description LIKE @${key} OR b.name LIKE @${key})`
      })
      where.push(`(${parts.join(' OR ')})`)
    }
  }
  if (query.category) {
    where.push(`(c.slug = @category OR c.id IN (
      SELECT id FROM categories WHERE parent_id = (SELECT id FROM categories WHERE slug = @category)
    ))`)
    params.category = query.category
  }
  if (query.sport) {
    // Live facets may use slug#id when names collide (e.g. vucut-gelistirme)
    where.push('s.slug = @sport')
    params.sport = String(query.sport).split('#')[0]
  }
  if (query.brand) {
    const brands = String(query.brand).split(',').filter(Boolean)
    if (brands.length) {
      where.push(`b.slug IN (${brands.map((_, i) => `@brand${i}`).join(',')})`)
      brands.forEach((b, i) => {
        params[`brand${i}`] = b
      })
    }
  }
  if (query.gender) {
    // Live deals gender facets → our product.gender values
    const genderGroups = {
      kadin: ['kadin'],
      erkek: ['erkek'],
      cocuk: ['cocuk', 'kiz-cocuk', 'erkek-cocuk', 'bebek', 'kiz-bebek', 'erkek-bebek'],
      'kiz-cocuk': ['cocuk', 'kiz-cocuk'],
      'erkek-cocuk': ['cocuk', 'erkek-cocuk'],
      bebek: ['cocuk', 'bebek', 'kiz-bebek', 'erkek-bebek'],
      'kiz-bebek': ['cocuk', 'bebek', 'kiz-bebek'],
      'erkek-bebek': ['cocuk', 'bebek', 'erkek-bebek'],
      yetiskin: ['erkek', 'kadin'],
      unisex: ['unisex'],
      'unisex-tum-yas-gruplari-icin-uygun': ['unisex'],
      at: ['at'],
      midilli: ['midilli'],
    }
    const genders = genderGroups[String(query.gender)] || [String(query.gender)]
    where.push(`p.gender IN (${genders.map((_, i) => `@gender${i}`).join(',')})`)
    genders.forEach((g, i) => {
      params[`gender${i}`] = g
    })
  }
  if (query.deal === '1' || query.deal === 'true') {
    where.push('p.is_deal = 1')
  }
  if (query.minPrice) {
    where.push('p.price_kurus >= @minPrice')
    params.minPrice = Number(query.minPrice)
  }
  if (query.maxPrice) {
    where.push('p.price_kurus <= @maxPrice')
    params.maxPrice = Number(query.maxPrice)
  }
  if (query.color) {
    // Live color family slug (siyah, mavi…) matches variant color text
    const colorToken = String(query.color).replace(/-/g, ' ')
    where.push(`EXISTS (
      SELECT 1 FROM product_variants v
      WHERE v.product_id = p.id AND v.stock > 0
        AND lower(v.color) LIKE @colorLike
    )`)
    params.colorLike = `%${colorToken}%`
  }
  if (query.size) {
    const sizeSlug = String(query.size)
    const sizeName = sizeSlug.replace(/-/g, ' ')
    where.push(`EXISTS (
      SELECT 1 FROM product_variants v
      WHERE v.product_id = p.id AND v.stock > 0
        AND (
          lower(v.size) = lower(@sizeName)
          OR lower(replace(v.size, ' ', '-')) = lower(@sizeSlug)
        )
    )`)
    params.sizeName = sizeName
    params.sizeSlug = sizeSlug
  }

  let orderBy = 'p.id DESC'
  switch (query.sort) {
    case 'price_asc':
      orderBy = 'p.price_kurus ASC'
      break
    case 'price_desc':
      orderBy = 'p.price_kurus DESC'
      break
    case 'rating':
      orderBy = 'p.rating DESC'
      break
    case 'newest':
      orderBy = 'p.is_new DESC, p.id DESC'
      break
    default:
      orderBy = 'p.review_count DESC'
  }

  const whereSql = where.length ? `WHERE ${where.join(' AND ')}` : ''
  return { whereSql, params, orderBy }
}

router.get('/products', (req, res) => {
  const page = Math.max(1, Number(req.query.page) || 1)
  const pageSize = Math.min(48, Math.max(1, Number(req.query.pageSize) || 24))
  const offset = (page - 1) * pageSize
  const { whereSql, params, orderBy } = buildProductQuery(req.query)

  const total = db
    .prepare(
      `SELECT COUNT(*) AS c FROM products p
       JOIN brands b ON b.id = p.brand_id
       JOIN categories c ON c.id = p.category_id
       LEFT JOIN sports s ON s.id = p.sport_id
       ${whereSql}`
    )
    .get(params).c

  const rows = db
    .prepare(
      `${productSelect}
       ${whereSql}
       ORDER BY ${orderBy}
       LIMIT @limit OFFSET @offset`
    )
    .all({ ...params, limit: pageSize, offset })

  res.json({
    items: rows.map(mapProduct),
    page,
    pageSize,
    total,
    totalPages: Math.ceil(total / pageSize) || 1,
  })
})

router.get('/products/:slug', (req, res) => {
  const row = db
    .prepare(`${productSelect} WHERE p.slug = ?`)
    .get(req.params.slug)
  if (!row) return res.status(404).json({ error: 'Ürün bulunamadı.' })

  const variants = db
    .prepare(
      `SELECT id, color, size, stock FROM product_variants WHERE product_id = ? ORDER BY color, size`
    )
    .all(row.id)
  const images = db
    .prepare(`SELECT url, sort_order AS sortOrder FROM product_images WHERE product_id = ? ORDER BY sort_order`)
    .all(row.id)

  const related = db
    .prepare(
      `${productSelect} WHERE p.category_id = ? AND p.id != ? ORDER BY p.review_count DESC LIMIT 8`
    )
    .all(row.category_id, row.id)
    .map(mapProduct)

  res.json({
    ...mapProduct(row),
    variants,
    images,
    related,
    colors: [...new Set(variants.map((v) => v.color))],
    sizes: [...new Set(variants.map((v) => v.size))],
  })
})

router.get('/filters', (req, res) => {
  const { whereSql, params } = buildProductQuery(req.query)
  const base = `FROM products p
    JOIN brands b ON b.id = p.brand_id
    JOIN categories c ON c.id = p.category_id
    LEFT JOIN sports s ON s.id = p.sport_id
    ${whereSql}`

  const brands = db
    .prepare(
      `SELECT b.slug, b.name, COUNT(*) AS count ${base} GROUP BY b.id ORDER BY count DESC`
    )
    .all(params)
  const genders = db
    .prepare(
      `SELECT p.gender AS slug, COUNT(*) AS count ${base} ${
        whereSql ? 'AND' : 'WHERE'
      } p.gender IS NOT NULL GROUP BY p.gender`
    )
    .all(params)
  const colors = db
    .prepare(
      `SELECT v.color AS slug, v.color AS name, COUNT(DISTINCT p.id) AS count
       FROM product_variants v
       JOIN products p ON p.id = v.product_id
       JOIN brands b ON b.id = p.brand_id
       JOIN categories c ON c.id = p.category_id
       LEFT JOIN sports s ON s.id = p.sport_id
       ${whereSql ? whereSql + ' AND' : 'WHERE'} v.stock > 0
       GROUP BY v.color ORDER BY count DESC`
    )
    .all(params)
  const price = db.prepare(`SELECT MIN(p.price_kurus) AS min, MAX(p.price_kurus) AS max ${base}`).get(params)
  const sports = db
    .prepare(
      `SELECT s.slug, s.name, COUNT(*) AS count ${base} ${
        whereSql ? 'AND' : 'WHERE'
      } s.id IS NOT NULL GROUP BY s.id ORDER BY count DESC`
    )
    .all(params)
  const sizes = db
    .prepare(
      `SELECT v.size AS slug, v.size AS name, COUNT(DISTINCT p.id) AS count
       FROM product_variants v
       JOIN products p ON p.id = v.product_id
       JOIN brands b ON b.id = p.brand_id
       JOIN categories c ON c.id = p.category_id
       LEFT JOIN sports s ON s.id = p.sport_id
       ${whereSql ? whereSql + ' AND' : 'WHERE'} v.stock > 0
       GROUP BY v.size ORDER BY count DESC`
    )
    .all(params)
  const categories = db
    .prepare(
      `SELECT c.slug, c.name, COUNT(*) AS count ${base} GROUP BY c.id ORDER BY count DESC`
    )
    .all(params)

  // Live /deals filter menus (commercialProductNature etc.) — identical labels + counts
  if (req.query.deal === '1' || req.query.deal === 'true') {
    const live = getDealsFacets()
    const pick = (list, { uniqueSlug = false } = {}) => {
      const rows = list || []
      const collisions = uniqueSlug
        ? rows.reduce((m, x) => m.set(x.slug, (m.get(x.slug) || 0) + 1), new Map())
        : null
      return rows.map((x) => ({
        slug:
          uniqueSlug && collisions.get(x.slug) > 1 && x.id != null
            ? `${x.slug}#${x.id}`
            : x.slug,
        name: x.name,
        count: x.count,
      }))
    }
    return res.json({
      brands: pick(live.brands),
      genders: pick(live.genders),
      colors: pick(live.colors),
      sports: pick(live.sports, { uniqueSlug: true }),
      sizes: pick(live.sizes),
      categories: pick(live.natures),
      // Live commercial price rail (₺20–₺179.000); fall back to catalog extremes
      price: live.price || price,
    })
  }

  res.json({ brands, genders, colors, price, sports, sizes, categories })
})

router.get('/categories', (_req, res) => {
  const rows = db.prepare('SELECT * FROM categories ORDER BY sort_order, id').all()
  const byParent = new Map()
  for (const row of rows) {
    const key = row.parent_id ?? 0
    if (!byParent.has(key)) byParent.set(key, [])
    byParent.get(key).push(row)
  }
  const tree = (byParent.get(0) || []).map((parent) => ({
    id: parent.id,
    slug: parent.slug,
    name: parent.name,
    gender: parent.gender,
    children: (byParent.get(parent.id) || []).map((c) => ({
      id: c.id,
      slug: c.slug,
      name: c.name,
      gender: c.gender,
    })),
  }))
  res.json(tree)
})

router.get('/sports', (_req, res) => {
  res.json(db.prepare('SELECT slug, name FROM sports ORDER BY name').all())
})

router.get('/brands', (_req, res) => {
  res.json(db.prepare('SELECT slug, name FROM brands ORDER BY name').all())
})

router.get('/home', (_req, res) => {
  // Live homepage "Popüler Ürünler" order (decathlon.com.tr)
  const popularSlugs = [
    'outdoor-paslanmaz-celik-termos-07l',
    'erkek-outdoor-su-gecirmez-kar-montu-nh500',
    'cocuk-futbol-termal-iclik-keepdry',
    'uv-korumali-semsiye-125cm-profilter',
    'proforce-plastik-kettlebell-10kg',
    'erkek-outdoor-polar-mont-mh500',
    'usr-root-201-badminton-raket-seti',
    'futbol-topu-5-numara-fifa',
    'yoga-roller-33cm-siyah',
    'yetiskin-tenis-raketi-tr-easy-graph-lite',
  ]
  const popularBySlug = Object.fromEntries(
    db
      .prepare(
        `${productSelect} WHERE p.slug IN (${popularSlugs.map(() => '?').join(',')})`
      )
      .all(...popularSlugs)
      .map((row) => [row.slug, mapProduct(row)])
  )
  const popular = popularSlugs.map((slug) => popularBySlug[slug]).filter(Boolean)

  // Live homepage "Sizin İçin Seçtiklerimiz" order (decathlon.com.tr)
  const featuredSlugs = [
    'yetiskin-scooter-acik-yesil-t7xl',
    'fitness-mati-15mm-bordo',
    'arena-yaris-yuzucu-gozlugu-python-mirror',
    'teleskopik-surf-kamis-symbios-500',
    'cocuk-scooteri-3-tekerlekli-mavi-btwin-b100',
    'tenis-topu-3-adet-turuncu-tb110',
    'arena-baskili-silikon-yuzucu-bonesi-print-2',
    'mini-futbol-topu-sampiyonlar-ligi-finali-2526',
    'cocuk-boks-eldiveni-kirmizi',
    'usr-blast-ittf-onayli-masa-tenisi-raketi',
  ]
  const featuredBySlug = Object.fromEntries(
    db
      .prepare(
        `${productSelect} WHERE p.slug IN (${featuredSlugs.map(() => '?').join(',')})`
      )
      .all(...featuredSlugs)
      .map((row) => [row.slug, mapProduct(row)])
  )
  const featured = featuredSlugs.map((slug) => featuredBySlug[slug]).filter(Boolean)

  // Live homepage "Katmanlı Giyim" shoppable-media order
  const layeredSlugs = [
    'erkek-sicak-tutan-ust-kayak-termal-icligi-bl-100',
    'erkek-kayak-snowboard-montu-siyah-100',
    'erkek-outdoor-polar-bej-mh500',
    'erkek-termal-alt-kayak-icligi-bl-100',
  ]
  const layeredBySlug = Object.fromEntries(
    db
      .prepare(
        `${productSelect} WHERE p.slug IN (${layeredSlugs.map(() => '?').join(',')})`
      )
      .all(...layeredSlugs)
      .map((row) => [row.slug, mapProduct(row)])
  )
  const layered = layeredSlugs.map((slug) => layeredBySlug[slug]).filter(Boolean)

  // Live homepage ends at Servisler → footer (no İndirimli Ürünler shelf)
  res.json({
    sections: [
      { id: 'popular', title: 'Popüler Ürünler', products: popular },
      { id: 'featured', title: 'Sizin İçin Seçtiklerimiz', products: featured },
      { id: 'layered', title: 'Katmanlı Giyim', products: layered },
    ],
    services: [
      { title: 'Kişiselleştirme', to: '/sayfa/atolye' },
      { title: 'Kurumsal Satış', to: '/sayfa/bize-ulasin' },
      { title: 'Mağazadan Teslim', to: '/sayfa/magazadan-teslim' },
      { title: 'Member Avantajları', to: '/sayfa/member-avantajlari' },
    ],
  })
})

export default router
