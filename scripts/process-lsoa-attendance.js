#!/usr/bin/env node
/**
 * Processes southampton-lsoa-attendance.csv to produce:
 *   1. public/geo/southampton-lsoa-pa.geojson  — LSOA GeoJSON with paPercent property
 *   2. public/data/lsoa-postcodes.json          — { "E01017207": ["SO16 4DU", ...], ... }
 *
 * Usage: node scripts/process-lsoa-attendance.js
 */

const fs = require('fs')
const path = require('path')

const CSV_PATH     = path.resolve(__dirname, '../public/data/southampton-lsoa-attendance.csv')
const GEOJSON_IN   = path.resolve(__dirname, '../public/geo/southampton-lsoa.geojson')
const GEOJSON_OUT  = path.resolve(__dirname, '../public/geo/southampton-lsoa-pa.geojson')
const POSTCODES_OUT = path.resolve(__dirname, '../public/data/lsoa-postcodes.json')

// ── Parse CSV ─────────────────────────────────────────────────────────────────

function parseCsv(raw) {
  const lines = raw.replace(/^\uFEFF/, '').trim().split('\n')
  return lines.slice(1).map(line => {
    const cols = line.split(',')
    return {
      lsoa:       cols[0]?.trim(),
      postcode:   cols[1]?.trim(),
      total:      parseFloat(cols[2]) || 0,
      paPercent:  parseFloat(cols[3]) || 0,
    }
  }).filter(r => r.lsoa && r.postcode)
}

// ── Main ──────────────────────────────────────────────────────────────────────

function main() {
  console.log('Reading CSV...')
  const rows = parseCsv(fs.readFileSync(CSV_PATH, 'utf8'))
  console.log(`  ${rows.length} postcode rows`)

  // Build LSOA → postcodes lookup
  const lsoaPostcodes = {}
  for (const row of rows) {
    if (!lsoaPostcodes[row.lsoa]) lsoaPostcodes[row.lsoa] = []
    lsoaPostcodes[row.lsoa].push(row.postcode)
  }
  console.log(`  ${Object.keys(lsoaPostcodes).length} unique LSOAs`)

  // Compute weighted PA% per LSOA: sum(pa% * total) / sum(total)
  const lsoaPa = {}
  const lsoaTotals = {}
  for (const row of rows) {
    lsoaPa[row.lsoa]     = (lsoaPa[row.lsoa]     || 0) + row.paPercent * row.total
    lsoaTotals[row.lsoa] = (lsoaTotals[row.lsoa] || 0) + row.total
  }
  const lsoaWeightedPa = {}
  for (const code of Object.keys(lsoaPa)) {
    lsoaWeightedPa[code] = lsoaTotals[code] > 0
      ? parseFloat((lsoaPa[code] / lsoaTotals[code]).toFixed(2))
      : 0
  }

  // Write lsoa-postcodes.json
  fs.writeFileSync(POSTCODES_OUT, JSON.stringify(lsoaPostcodes, null, 2))
  console.log(`\nWrote ${POSTCODES_OUT}`)

  // Augment GeoJSON with paPercent
  console.log('\nReading base GeoJSON...')
  const geojson = JSON.parse(fs.readFileSync(GEOJSON_IN, 'utf8'))

  let matched = 0
  for (const feature of geojson.features) {
    const code = feature.properties.LSOA21CD
    if (lsoaWeightedPa[code] !== undefined) {
      feature.properties.paPercent = lsoaWeightedPa[code]
      matched++
    } else {
      feature.properties.paPercent = null
    }
  }
  console.log(`  ${matched}/${geojson.features.length} LSOAs matched with PA data`)

  fs.writeFileSync(GEOJSON_OUT, JSON.stringify(geojson))
  console.log(`Wrote ${GEOJSON_OUT}`)
}

main()
