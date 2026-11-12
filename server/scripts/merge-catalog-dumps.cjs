/**
 * Merge CDP dump JSON files + existing deals-products.json into one catalog.
 * Usage: node server/scripts/merge-catalog-dumps.cjs [dump1.json dump2.json ...]
 */
const fs = require('fs')
const path = require('path')

const dbDir = path.join(__dirname, '../src/db')
const outPath = path.join(dbDir, 'deals-products.json')
const bySku = Object.create(null)
const list = []

function ingest(arr, label) {
  let added = 0
  for (const p of arr) {
    if (!p || !p.sku) continue
    if (bySku[p.sku]) {
      // Prefer deal flag / richer compare from newer or deal rows
      if (p.isDeal && !bySku[p.sku].isDeal) bySku[p.sku].isDeal = 1
      if (p.compare && !bySku[p.sku].compare) bySku[p.sku].compare = p.compare
      continue
    }
    bySku[p.sku] = p
    list.push(p)
    added++
  }
  console.log(label, { input: arr.length, added, total: list.length })
}

const existing = path.join(dbDir, 'deals-products.json')
if (fs.existsSync(existing)) {
  ingest(JSON.parse(fs.readFileSync(existing, 'utf8')), 'existing')
}

for (const f of process.argv.slice(2)) {
  const j = JSON.parse(fs.readFileSync(f, 'utf8'))
  const arr = Array.isArray(j) ? j : j.result?.value ? JSON.parse(j.result.value) : j.list || []
  ingest(Array.isArray(arr) ? arr : [], f)
}

fs.writeFileSync(outPath, JSON.stringify(list))
console.log('wrote', outPath, list.length, 'bytes', fs.statSync(outPath).size)
