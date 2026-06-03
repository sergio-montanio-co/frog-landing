import express from 'express'
import path from 'path'
import { fileURLToPath } from 'url'
import { handler as astroHandler } from './dist/server/entry.mjs'

const __dirname = path.dirname(fileURLToPath(import.meta.url))
const app = express()
const PORT = process.env.PORT || 3000

// The node adapter (middleware mode) splits the build:
//   dist/client  -> static assets + prerendered HTML + public/ (incl. .well-known)
//   dist/server  -> on-demand handler (renders /join/[code])
const CLIENT_DIR = path.join(__dirname, 'dist', 'client')
const WELL_KNOWN_DIR = path.join(CLIENT_DIR, '.well-known')

// === AASA y assetlinks con Content-Type correcto ===
// Deben ir ANTES del static y del handler de Astro para garantizar
// el header exacto que Apple/Google verifican.
app.get('/.well-known/apple-app-site-association', (req, res) => {
  res.setHeader('Content-Type', 'application/json; charset=utf-8')
  res.setHeader('Cache-Control', 'public, max-age=3600')
  res.sendFile(
    path.join(WELL_KNOWN_DIR, 'apple-app-site-association'),
    (err) => {
      if (err) res.status(404).end()
    },
  )
})

app.get('/.well-known/assetlinks.json', (req, res) => {
  res.setHeader('Content-Type', 'application/json; charset=utf-8')
  res.setHeader('Cache-Control', 'public, max-age=3600')
  res.sendFile(
    path.join(WELL_KNOWN_DIR, 'assetlinks.json'),
    (err) => {
      if (err) res.status(404).end()
    },
  )
})

// === Healthcheck para Railway ===
app.get('/healthz', (req, res) => {
  res.status(200).json({ status: 'ok' })
})

// === Static del Astro build (HTML prerenderizado + assets) ===
app.use(
  express.static(CLIENT_DIR, {
    maxAge: '1d',
    extensions: ['html'],
    setHeaders: (res) => {
      res.setHeader('X-Content-Type-Options', 'nosniff')
      res.setHeader('Referrer-Policy', 'strict-origin-when-cross-origin')
    },
  }),
)

// === Astro SSR para rutas on-demand (/join/[code]) y 404 ===
app.use(astroHandler)

app.listen(PORT, () => {
  console.log(`Frog landing listening on port ${PORT}`)
})
