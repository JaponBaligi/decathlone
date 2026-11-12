import express from 'express'
import cors from 'cors'
import cookieParser from 'cookie-parser'
import path from 'node:path'
import { fileURLToPath } from 'node:url'
import { migrate } from './db/schema.js'
import catalogRoutes from './routes/catalog.js'
import authRoutes from './routes/auth.js'
import cartRoutes from './routes/cart.js'
import orderRoutes from './routes/orders.js'
import wishlistRoutes from './routes/wishlist.js'
import storeRoutes from './routes/stores.js'
import cmsRoutes from './routes/cms.js'
import accountRoutes from './routes/account.js'

migrate()

const app = express()
const PORT = process.env.PORT || 3001
const __dirname = path.dirname(fileURLToPath(import.meta.url))

app.use(
  cors({
    origin: ['http://localhost:5173', 'http://127.0.0.1:5173'],
    exposedHeaders: ['X-Guest-Token'],
  })
)
app.use(express.json())
app.use(cookieParser())

app.get('/api/health', (_req, res) => {
  res.json({ ok: true, service: 'decathlon-clone-api' })
})

app.use('/api/catalog', catalogRoutes)
app.use('/api/auth', authRoutes)
app.use('/api/cart', cartRoutes)
app.use('/api/orders', orderRoutes)
app.use('/api/wishlist', wishlistRoutes)
app.use('/api/stores', storeRoutes)
app.use('/api/cms', cmsRoutes)
app.use('/api/account', accountRoutes)

const clientDist = path.resolve(__dirname, '../../client/dist')
app.use(express.static(clientDist))
app.get(/^(?!\/api).*/, (req, res, next) => {
  if (req.method !== 'GET') return next()
  res.sendFile(path.join(clientDist, 'index.html'), (err) => {
    if (err) next()
  })
})

app.use((err, _req, res, _next) => {
  console.error(err)
  res.status(500).json({ error: 'Sunucu hatası.' })
})

app.listen(PORT, () => {
  console.log(`API listening on http://localhost:${PORT}`)
})
