#!/usr/bin/env node
/**
 * Converts Southampton LSOA GeoJSON boundaries to a downloadable SVG file.
 * Usage: node scripts/lsoa-to-svg.js [output-path]
 */

const fs = require('fs')
const path = require('path')

const INPUT = path.resolve(__dirname, '../public/geo/LSOA.geojson')
const PA_GEOJSON = path.resolve(__dirname, '../public/geo/southampton-lsoa-pa.geojson')
const OUTPUT = process.argv[2] || path.resolve(__dirname, '../southampton-lsoa.svg')

// SVG dimensions
const WIDTH = 1200
const HEIGHT = 1400
const PADDING = 40

// PA heatmap colour scale (0–5%, 5–10%, ..., 40–45%, 45%+)
const PA_COLORS = [
  '#f5d8e8', '#ebc2d7', '#e1acc6', '#d796b5', '#cd7fa5',
  '#c26994', '#b85383', '#ae3c73', '#a42662', '#9a1051',
]
const NO_DATA_COLOR = '#d0d0d0'
const FILL_OPACITY = 0.85
const STROKE_COLOR = '#7a0038'
const STROKE_WIDTH = 0.8
const BG_COLOR = '#f5f5f5'

function paColor(paPercent) {
  if (paPercent === null || paPercent === undefined) return NO_DATA_COLOR
  const idx = Math.min(9, Math.floor(paPercent / 5))
  return PA_COLORS[idx]
}

// Mercator projection helpers
function toMercatorX(lng) {
  return (lng + 180) / 360
}

function toMercatorY(lat) {
  const latRad = (lat * Math.PI) / 180
  const mercN = Math.log(Math.tan(Math.PI / 4 + latRad / 2))
  return 0.5 - mercN / (2 * Math.PI)
}

function main() {
  // Build paPercent lookup from processed PA GeoJSON
  const paMap = new Map()
  if (fs.existsSync(PA_GEOJSON)) {
    const paData = JSON.parse(fs.readFileSync(PA_GEOJSON, 'utf8'))
    for (const f of paData.features) {
      paMap.set(f.properties.LSOA21CD, f.properties.paPercent)
    }
    console.log(`Loaded PA data for ${paMap.size} LSOAs`)
  } else {
    console.warn(`PA GeoJSON not found at ${PA_GEOJSON} — all areas will use no-data colour`)
  }

  console.log('Reading LSOA GeoJSON...')
  const data = JSON.parse(fs.readFileSync(INPUT, 'utf8'))

  // Filter Southampton features
  const features = data.features.filter(
    f => f.properties.LSOA21NM && f.properties.LSOA21NM.startsWith('Southampton')
  )
  console.log(`Found ${features.length} Southampton LSOA areas`)

  // Collect all coordinates to compute bounding box
  let minX = Infinity, maxX = -Infinity
  let minY = Infinity, maxY = -Infinity

  function processCoord(coord) {
    const x = toMercatorX(coord[0])
    const y = toMercatorY(coord[1])
    if (x < minX) minX = x
    if (x > maxX) maxX = x
    if (y < minY) minY = y
    if (y > maxY) maxY = y
    return [x, y]
  }

  // First pass: project all coordinates and find bounds
  const projected = features.map(f => {
    const geom = f.geometry
    let rings

    if (geom.type === 'Polygon') {
      rings = geom.coordinates.map(ring => ring.map(processCoord))
    } else if (geom.type === 'MultiPolygon') {
      rings = geom.coordinates.flatMap(poly => poly.map(ring => ring.map(processCoord)))
    }

    return { properties: f.properties, rings }
  })

  // Compute scale to fit within SVG
  const geoWidth = maxX - minX
  const geoHeight = maxY - minY
  const drawWidth = WIDTH - PADDING * 2
  const drawHeight = HEIGHT - PADDING * 2

  const scale = Math.min(drawWidth / geoWidth, drawHeight / geoHeight)

  // Center the drawing
  const offsetX = PADDING + (drawWidth - geoWidth * scale) / 2
  const offsetY = PADDING + (drawHeight - geoHeight * scale) / 2

  function toSvgX(mx) {
    return offsetX + (mx - minX) * scale
  }

  function toSvgY(my) {
    return offsetY + (my - minY) * scale
  }

  // Build SVG paths
  const paths = projected.map(f => {
    const name = f.properties.LSOA21NM
    const code = f.properties.LSOA21CD

    const d = f.rings
      .map(ring => {
        const points = ring.map(([mx, my]) => `${toSvgX(mx).toFixed(2)},${toSvgY(my).toFixed(2)}`)
        return `M ${points.join(' L ')} Z`
      })
      .join(' ')

    const fill = paColor(paMap.get(code))
    return `    <path d="${d}" fill="${fill}" fill-opacity="${FILL_OPACITY}" stroke="${STROKE_COLOR}" stroke-width="${STROKE_WIDTH}" data-lsoa-code="${code}"><title>${name}</title></path>`
  })

  // Build labels (centered on each LSOA)
  const labels = projected.map(f => {
    const name = f.properties.LSOA21NM.replace('Southampton ', '')
    // Compute centroid of first ring
    const ring = f.rings[0]
    let cx = 0, cy = 0
    ring.forEach(([mx, my]) => {
      cx += mx
      cy += my
    })
    cx /= ring.length
    cy /= ring.length

    const sx = toSvgX(cx).toFixed(2)
    const sy = toSvgY(cy).toFixed(2)

    return `    <text x="${sx}" y="${sy}" text-anchor="middle" dominant-baseline="central" font-size="7" font-family="Arial, sans-serif" fill="#1a1a1a" opacity="0.7" pointer-events="none">${name}</text>`
  })

  // Build legend
  const legendX = PADDING
  const legendY = HEIGHT - 80
  const swatchW = 60
  const swatchH = 18
  const legendItems = PA_COLORS.map((color, i) => {
    const lx = legendX + i * (swatchW + 2)
    const label = i === 0 ? '0%' : i === 9 ? '45%+' : `${i * 5}%`
    return `    <rect x="${lx}" y="${legendY}" width="${swatchW}" height="${swatchH}" fill="${color}" fill-opacity="0.85" stroke="${STROKE_COLOR}" stroke-width="0.5"/>
    <text x="${lx + swatchW / 2}" y="${legendY + swatchH + 12}" text-anchor="middle" font-size="9" font-family="Arial, sans-serif" fill="#444">${label}</text>`
  }).join('\n')

  const svg = `<?xml version="1.0" encoding="UTF-8"?>
<svg xmlns="http://www.w3.org/2000/svg" width="${WIDTH}" height="${HEIGHT}" viewBox="0 0 ${WIDTH} ${HEIGHT}">
  <rect width="${WIDTH}" height="${HEIGHT}" fill="${BG_COLOR}" />
  <text x="${WIDTH / 2}" y="28" text-anchor="middle" font-size="20" font-weight="bold" font-family="Arial, sans-serif" fill="#333">Southampton LSOA PA% Heatmap</text>
  <g id="lsoa-areas">
${paths.join('\n')}
  </g>
  <g id="lsoa-labels">
${labels.join('\n')}
  </g>
  <g id="legend">
    <text x="${legendX}" y="${legendY - 8}" font-size="11" font-family="Arial, sans-serif" fill="#555">Persistent Absence %</text>
${legendItems}
  </g>
</svg>`

  fs.writeFileSync(OUTPUT, svg)
  console.log(`SVG written to ${OUTPUT}`)
  console.log(`File size: ${(Buffer.byteLength(svg) / 1024).toFixed(1)} KB`)
}

main()
