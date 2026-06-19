#!/usr/bin/env node
/**
 * Geocodes postcodes from the Southampton attendance CSV using postcodes.io
 * and writes a JSON file ready for use in AttendanceMap.vue.
 *
 * Usage: node scripts/geocode-attendance.js
 * Output: public/data/southampton-attendance.json
 */

const fs = require('fs')
const path = require('path')

const CSV_PATH = path.resolve(__dirname, '../public/data/southampton-attendance.csv')
const OUT_PATH = path.resolve(__dirname, '../public/data/southampton-attendance.json')
const BATCH_SIZE = 100
const BATCH_DELAY_MS = 200

// ── Parse CSV ─────────────────────────────────────────────────────────────────

function parseCsv(raw) {
  const lines = raw.replace(/^\uFEFF/, '').trim().split('\n')
  return lines
    .slice(1)
    .map(line => {
      const cols = line.split(',')
      return {
        postcode: cols[0]?.trim(),
        total: parseInt(cols[1]) || 0,
        spa: parseInt(cols[2]) || 0,
        pa: parseInt(cols[3]) || 0,
        below: parseInt(cols[4]) || 0,
        above: parseInt(cols[5]) || 0,
      }
    })
    .filter(r => r.postcode && r.total > 0)
}

// ── Geocode ───────────────────────────────────────────────────────────────────

async function batchGeocode(postcodes) {
  const results = new Map()

  for (let i = 0; i < postcodes.length; i += BATCH_SIZE) {
    const batch = postcodes.slice(i, i + BATCH_SIZE)
    const batchNum = Math.floor(i / BATCH_SIZE) + 1
    const totalBatches = Math.ceil(postcodes.length / BATCH_SIZE)
    process.stdout.write(`  Batch ${batchNum}/${totalBatches} (${batch.length} postcodes)... `)

    try {
      const response = await fetch('https://api.postcodes.io/postcodes', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ postcodes: batch }),
      })

      if (!response.ok) throw new Error(`HTTP ${response.status}`)

      const data = await response.json()

      let found = 0
      for (const item of data.result) {
        if (item.result) {
          results.set(item.query.trim().toUpperCase(), {
            lat: item.result.latitude,
            lng: item.result.longitude,
          })
          found++
        }
      }
      console.log(`${found}/${batch.length} resolved`)
    } catch (err) {
      console.error(`FAILED: ${err.message}`)
    }

    if (i + BATCH_SIZE < postcodes.length) {
      await new Promise(r => setTimeout(r, BATCH_DELAY_MS))
    }
  }

  return results
}

// ── Main ──────────────────────────────────────────────────────────────────────

async function main() {
  console.log('Reading CSV...')
  const csv = fs.readFileSync(CSV_PATH, 'utf8')
  const rows = parseCsv(csv)
  console.log(`  ${rows.length} postcodes found in CSV`)

  // Deduplicate postcodes for geocoding
  const uniquePostcodes = [...new Set(rows.map(r => r.postcode.toUpperCase()))]
  console.log(`  ${uniquePostcodes.length} unique postcodes to geocode`)

  console.log('\nGeocoding via postcodes.io...')
  const coords = await batchGeocode(uniquePostcodes)
  console.log(`\n  Resolved: ${coords.size}/${uniquePostcodes.length}`)

  const missing = uniquePostcodes.filter(p => !coords.has(p))
  if (missing.length) {
    console.log(`  Not found: ${missing.join(', ')}`)
  }

  // Build output records
  const records = []
  for (const row of rows) {
    const key = row.postcode.toUpperCase()
    const coord = coords.get(key)
    if (!coord) continue
    records.push({
      postcode: row.postcode,
      lat: coord.lat,
      lng: coord.lng,
      total: row.total,
      spa: row.spa,
      pa: row.pa,
      below: row.below,
      above: row.above,
    })
  }

  fs.mkdirSync(path.dirname(OUT_PATH), { recursive: true })
  fs.writeFileSync(OUT_PATH, JSON.stringify(records, null, 2))

  const totalPupils = records.reduce((s, r) => s + r.total, 0)
  console.log(`\nWrote ${records.length} postcodes (${totalPupils} pupils) → ${OUT_PATH}`)
}

main().catch(err => {
  console.error(err)
  process.exit(1)
})
