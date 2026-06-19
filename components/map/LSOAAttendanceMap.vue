<template>
  <div class="lam-wrapper">
    <div ref="mapContainer" class="map-container" />
    <pre v-if="errorMsg" class="map-error">{{ errorMsg }}</pre>

    <!-- Hover tooltip -->
    <div
      v-if="tooltip.visible"
      class="lam-tooltip"
      :style="{ left: tooltip.x + 'px', top: tooltip.y + 'px' }"
    >
      <div class="lam-tooltip-name">{{ tooltip.name }}</div>
      <div class="lam-tooltip-pa">
        PA: <strong>{{ tooltip.paPercent !== null ? tooltip.paPercent + '%' : 'N/A' }}</strong>
      </div>
    </div>

    <!-- Legend -->
    <div class="lam-legend">
      <div class="legend-title">PA Heatmap</div>
      <div class="lam-scale">
        <div class="lam-scale-bar">
          <div
            v-for="(color, i) in PA_COLORS"
            :key="i"
            class="lam-scale-step"
            :style="{ background: color }"
          />
        </div>
        <div class="lam-scale-labels">
          <span>0%</span>
          <span>45%+</span>
        </div>
      </div>
      <div class="legend-subtitle">Persistent Absence Rate</div>

      <div class="legend-divider" />

      <div class="legend-title">Attendance Category</div>
      <div v-for="item in LEGEND" :key="item.key" class="legend-row">
        <span class="legend-dot" :style="{ background: item.color }" />
        <span class="legend-label">{{ item.label }}</span>
      </div>

      <div class="legend-divider" />

      <div v-if="selectedLsoa" class="lam-selected-info">
        <div class="lam-selected-name">{{ selectedLsoa.name }}</div>
        <div class="legend-hint">Click elsewhere to deselect</div>
      </div>
      <div v-else class="legend-hint">Click an LSOA area to explore pupil data</div>
    </div>

    <!-- Attendance drawer (identical to AttendanceMap) -->
    <transition name="am-drawer">
      <div v-if="drawer.isOpen" class="am-drawer">

        <!-- ── List view ─────────────────────────────────────── -->
        <template v-if="drawer.view === 'list'">
          <div class="am-drawer-header">
            <span class="am-drawer-title">{{ drawerPupils.length }} Pupils in {{ drawer.record?.postcode }}</span>
            <button class="am-drawer-close" @click="closeDrawer">✕</button>
          </div>
          <div class="am-drawer-body">
            <div class="am-legend-strip">
              <span class="am-ls-swatch am-ls-swatch--att"></span><span class="am-ls-label">Attendance</span>
              <span class="am-ls-swatch am-ls-swatch--auth"></span><span class="am-ls-label">Auth. Abs.</span>
              <span class="am-ls-swatch am-ls-swatch--unauth"></span><span class="am-ls-label">Unauth. Abs.</span>
            </div>
            <div class="am-col-headers">
              <span>PUPIL</span>
              <span>OVERALL ATT.</span>
            </div>
            <div
              v-for="(pupil, i) in drawerPupils"
              :key="i"
              class="am-pupil-row"
              @click="openPupilDetail(pupil)"
            >
              <span class="am-pupil-dot" :style="{ background: CATEGORY_COLORS[pupil.cat] }"></span>
              <div class="am-pupil-info">
                <div class="am-pupil-name">{{ pupil.name }}</div>
                <div class="am-pupil-school">{{ pupil.school }}</div>
                <div class="am-mini-bar">
                  <div class="am-mb-att"    :style="{ width: pupil.attendance + '%' }"></div>
                  <div class="am-mb-auth"   :style="{ width: pupil.authAbsence + '%' }"></div>
                  <div class="am-mb-unauth" :style="{ width: pupil.unauthAbsence + '%' }"></div>
                </div>
              </div>
              <div class="am-pupil-pct">{{ pupil.attendance }}%</div>
              <span class="am-chevron">›</span>
            </div>
          </div>
        </template>

        <!-- ── Detail view ───────────────────────────────────── -->
        <template v-else-if="drawer.view === 'detail'">
          <div class="am-drawer-header am-drawer-header--detail">
            <button class="am-drawer-back" @click="drawer.view = 'list'">‹</button>
            <span class="am-drawer-title">Pupil Details</span>
            <button class="am-drawer-close" @click="closeDrawer">✕</button>
          </div>
          <div class="am-drawer-body">
            <div class="am-detail-hero">
              <span class="am-pupil-dot am-pupil-dot--lg" :style="{ background: CATEGORY_COLORS[drawer.pupil?.cat] }"></span>
              <div>
                <div class="am-pupil-name">{{ drawer.pupil?.name }}</div>
                <div class="am-pupil-school">{{ drawer.pupil?.school }}</div>
              </div>
            </div>
            <div class="am-detail-meta">
              <div><span class="am-meta-label">UPN</span><span class="am-meta-val">{{ drawer.pupil?.upn }}</span></div>
              <div><span class="am-meta-label">Postcode</span><span class="am-meta-val">{{ drawer.record?.postcode }}</span></div>
            </div>
            <div class="am-stats-grid">
              <div class="am-stat"><div class="am-stat-label">NC Year</div><div class="am-stat-val">{{ drawer.pupil?.ncYear }}</div></div>
              <div class="am-stat"><div class="am-stat-label">Sex</div><div class="am-stat-val">{{ drawer.pupil?.sex }}</div></div>
              <div class="am-stat"><div class="am-stat-label">FSM</div><div class="am-stat-val">{{ drawer.pupil?.fsm ? 'Yes' : 'No' }}</div></div>
              <div class="am-stat"><div class="am-stat-label">SEN</div><div class="am-stat-val">{{ drawer.pupil?.sen ? 'Yes' : 'No' }}</div></div>
              <div class="am-stat"><div class="am-stat-label">Disadv.</div><div class="am-stat-val">{{ drawer.pupil?.disadv ? 'Yes' : 'No' }}</div></div>
              <div class="am-stat"><div class="am-stat-label">EAL</div><div class="am-stat-val">{{ drawer.pupil?.eal ? 'Yes' : 'No' }}</div></div>
              <div class="am-stat"><div class="am-stat-label">Min. Eth.</div><div class="am-stat-val">{{ drawer.pupil?.minEth ? 'Yes' : 'No' }}</div></div>
              <div class="am-stat"><div class="am-stat-label">CLA</div><div class="am-stat-val">{{ drawer.pupil?.cla ? 'Yes' : 'No' }}</div></div>
            </div>
            <div class="am-att-section">
              <div class="am-att-section-title">ATTENDANCE</div>
              <div class="am-att-overall">{{ drawer.pupil?.attendance }}%</div>
              <div class="am-att-overall-label">Overall Attendance</div>
              <div class="am-att-gap">
                <span class="am-meta-label">Gap to National</span>
                <span class="am-meta-val" :class="(drawer.pupil?.attendance ?? 0) < 94.5 ? 'am-neg' : 'am-pos'">
                  {{ drawer.pupil ? ((drawer.pupil.attendance - 94.5) >= 0 ? '+' : '') + (drawer.pupil.attendance - 94.5).toFixed(1) : '' }}%
                </span>
              </div>
            </div>
          </div>
        </template>

      </div>
    </transition>
  </div>
</template>

<script setup>
import { ref, reactive, computed, onMounted, onBeforeUnmount } from 'vue'
import maplibregl from 'maplibre-gl'
import 'maplibre-gl/dist/maplibre-gl.css'

// ── Constants ────────────────────────────────────────────────────────────────

const CATEGORY_COLORS = {
  SPA: '#8B0000',
  PA: '#DC143C',
  Below: '#F59E0B',
  Above: '#22C55E',
}

const ORDERED_CATS = ['SPA', 'PA', 'Below', 'Above']

const LEGEND = [
  { key: 'SPA',   label: 'Severe persistent absence', color: '#8B0000' },
  { key: 'PA',    label: 'Persistent absence',         color: '#DC143C' },
  { key: 'Below', label: 'Below average',              color: '#F59E0B' },
  { key: 'Above', label: 'Above average',              color: '#22C55E' },
]

// 10-step PA% colour scale from #f5d8e8 (light) → #9a1051 (dark)
const PA_COLORS = [
  '#f5d8e8', // 0–5%
  '#ebc2d7', // 5–10%
  '#e1acc6', // 10–15%
  '#d796b5', // 15–20%
  '#cd7fa5', // 20–25%
  '#c26994', // 25–30%
  '#b85383', // 30–35%
  '#ae3c73', // 35–40%
  '#a42662', // 40–45%
  '#9a1051', // 45%+
]

const PA_STEP_EXPR = [
  'step', ['coalesce', ['get', 'paPercent'], 0],
  PA_COLORS[0],
  5,  PA_COLORS[1],
  10, PA_COLORS[2],
  15, PA_COLORS[3],
  20, PA_COLORS[4],
  25, PA_COLORS[5],
  30, PA_COLORS[6],
  35, PA_COLORS[7],
  40, PA_COLORS[8],
  45, PA_COLORS[9],
]

const LSOA_SOURCE   = 'lam-lsoa-source'
const LSOA_FILL     = 'lam-lsoa-fill'
const LSOA_LINE     = 'lam-lsoa-line'
const LSOA_HOVER    = 'lam-lsoa-hover'
const LSOA_SELECTED = 'lam-lsoa-selected'

// ── Mock pupil generation (identical to AttendanceMap) ───────────────────────

const FIRST_NAMES_M = ['Oliver','George','Noah','Harry','Jack','Leo','Freddie','Charlie','Alfie','Oscar','Mason','Ethan','Liam','James','Thomas','Henry','Archie','Joshua','Isaac','Samuel']
const FIRST_NAMES_F = ['Olivia','Amelia','Isla','Ava','Emily','Grace','Freya','Lily','Sophie','Mia','Ella','Poppy','Isabella','Charlotte','Daisy','Alice','Ruby','Evie','Florence','Rosie']
const SURNAMES = ['Smith','Jones','Taylor','Brown','Williams','Wilson','Johnson','Davies','Robinson','Wright','Thompson','Evans','Walker','White','Roberts','Green','Hall','Wood','Jackson','Harris']
const SCHOOLS = [
  "St Mary's CE Primary",
  'Shirley Warren Primary',
  'Foundry Lane Primary',
  'Mansel Park Primary',
  'Woolston Infant School',
  "St Anne's Catholic Primary",
  'Redbridge Primary School',
  'Bitterne Park Primary',
  'Highfield CE Primary',
  'Newlands Primary School',
]

const ATT_RANGES = {
  SPA:   [40, 64],
  PA:    [65, 89],
  Below: [90, 94],
  Above: [95, 100],
}

function seededRng(seed) {
  let s = seed >>> 0
  return () => {
    s = Math.imul(s ^ (s >>> 16), 0x45d9f3b)
    s = Math.imul(s ^ (s >>> 16), 0x45d9f3b)
    s ^= s >>> 16
    return (s >>> 0) / 0xffffffff
  }
}

function generatePupils(record) {
  const seed = record.postcode.split('').reduce((a, c) => (a * 31 + c.charCodeAt(0)) | 0, 0)
  const rng = seededRng(seed)

  const catAssignments = []
  for (const cat of ORDERED_CATS) {
    const count = record[cat.toLowerCase()] ?? 0
    for (let i = 0; i < count; i++) catAssignments.push(cat)
  }

  return catAssignments.map((cat) => {
    const isMale = rng() > 0.5
    const names  = isMale ? FIRST_NAMES_M : FIRST_NAMES_F
    const first  = names[Math.floor(rng() * names.length)]
    const last   = SURNAMES[Math.floor(rng() * SURNAMES.length)]
    const [lo, hi] = ATT_RANGES[cat]
    const att      = Math.round((lo + rng() * (hi - lo)) * 10) / 10
    const authAbs  = Math.round(rng() * (100 - att) * 0.65 * 10) / 10
    const unauth   = Math.round(Math.max(0, 100 - att - authAbs) * 10) / 10
    const upn      = 'A' + Array.from({ length: 12 }, () => Math.floor(rng() * 10)).join('')
    return {
      name: `${first} ${last}`,
      sex: isMale ? 'Male' : 'Female',
      school: SCHOOLS[Math.floor(rng() * SCHOOLS.length)],
      attendance: att,
      authAbsence: authAbs,
      unauthAbsence: unauth,
      cat,
      ncYear: Math.floor(rng() * 6) + 1,
      upn,
      fsm:    rng() > 0.7,
      sen:    rng() > 0.82,
      disadv: rng() > 0.65,
      eal:    rng() > 0.85,
      minEth: rng() > 0.75,
      cla:    rng() > 0.95,
    }
  })
}

// ── Props ────────────────────────────────────────────────────────────────────

const props = defineProps({
  center: {
    type: Array,
    default: () => [-1.4044, 50.9097],
  },
  zoom: {
    type: Number,
    default: 12,
  },
})

// ── State ────────────────────────────────────────────────────────────────────

const mapContainer  = ref(null)
const map           = ref(null)
const errorMsg      = ref('')

/** All geocoded attendance records, keyed by uppercase postcode */
const postcodeMap = new Map()

/** LSOA code → array of postcodes (from lsoa-postcodes.json) */
let lsoaPostcodesMap = {}

/** Currently selected LSOA */
const selectedLsoa = ref(null)  // { code, name, featureId }
let hoveredFeatureId = null

/** Hover tooltip */
const tooltip = reactive({ visible: false, x: 0, y: 0, name: '', paPercent: null })

/** Active postcode markers for the selected LSOA */
const activeMarkers = new Map()

/** Exploded dot markers */
const explodedMarkers = []
let explodedPostcode = null

const drawer = reactive({
  isOpen: false,
  view: 'list',
  record: null,
  pupil: null,
})

const drawerPupils = computed(() =>
  drawer.record ? generatePupils(drawer.record) : []
)

// ── Drawer helpers ───────────────────────────────────────────────────────────

function openDrawer(record) {
  drawer.record = record
  drawer.view = 'list'
  drawer.pupil = null
  drawer.isOpen = true
}

function closeDrawer() {
  drawer.isOpen = false
  drawer.record = null
  drawer.pupil = null
}

function openPupilDetail(pupil) {
  drawer.pupil = pupil
  drawer.view = 'detail'
}

// ── Marker helpers (identical to AttendanceMap) ──────────────────────────────

function markerSize(total) {
  return Math.round(Math.min(56, Math.max(20, 7 + Math.sqrt(total) * 5.2)))
}

function pieSvg(record, size) {
  const r   = size / 2 - 1
  const cx  = size / 2
  const cy  = size / 2
  const ir  = r * 0.38
  const total = record.total

  let slices = ''
  let angle = -Math.PI / 2

  for (const cat of ORDERED_CATS) {
    const count = record[cat.toLowerCase()]
    if (!count) continue
    const sweep    = (count / total) * 2 * Math.PI
    const endAngle = angle + sweep
    const large    = sweep > Math.PI ? 1 : 0

    const x1 = (cx + r * Math.cos(angle)).toFixed(3)
    const y1 = (cy + r * Math.sin(angle)).toFixed(3)
    const x2 = (cx + r * Math.cos(endAngle)).toFixed(3)
    const y2 = (cy + r * Math.sin(endAngle)).toFixed(3)

    slices += `<path d="M${cx},${cy} L${x1},${y1} A${r},${r} 0 ${large},1 ${x2},${y2} Z" fill="${CATEGORY_COLORS[cat]}" />`
    angle = endAngle
  }

  const fs = size < 28 ? 8 : size < 38 ? 9 : 11
  return `<svg width="${size}" height="${size}" viewBox="0 0 ${size} ${size}" style="display:block">
    ${slices}
    <circle cx="${cx}" cy="${cy}" r="${ir}" fill="white"/>
    <text x="${cx}" y="${cy}" text-anchor="middle" dominant-baseline="central"
      font-size="${fs}" font-weight="600" fill="#333" font-family="system-ui,sans-serif">${total}</text>
  </svg>`
}

function makeCollapsedEl(record) {
  const size = markerSize(record.total)
  const el = document.createElement('div')
  el.className = 'am-collapsed'
  const inner = document.createElement('div')
  inner.className = 'am-collapsed-inner'
  inner.title = record.postcode
  inner.innerHTML = pieSvg(record, size)
  el.appendChild(inner)
  return el
}

function spiralOffsets(n) {
  if (n === 0) return []
  if (n === 1) return [[0, 0]]

  const dotGap  = n > 50 ? 11 : n > 25 ? 13 : 15
  const r0      = n > 50 ? 24 : n > 25 ? 28 : 32
  const offsets = []
  let radius    = r0

  while (offsets.length < n) {
    const circ     = 2 * Math.PI * radius
    const ringCount = Math.max(6, Math.floor(circ / dotGap))
    const step     = (2 * Math.PI) / ringCount
    const phase    = Math.floor(offsets.length / ringCount) % 2 ? step / 2 : 0

    for (let i = 0; i < ringCount && offsets.length < n; i++) {
      const a = phase + i * step
      offsets.push([Math.round(Math.cos(a) * radius), Math.round(Math.sin(a) * radius)])
    }
    radius += dotGap
  }
  return offsets
}

// ── Explode / collapse ───────────────────────────────────────────────────────

function collapseExploded() {
  for (const m of explodedMarkers) m.remove()
  explodedMarkers.length = 0

  if (explodedPostcode) {
    const entry = activeMarkers.get(explodedPostcode)
    if (entry) {
      const inner = entry.el.querySelector('.am-collapsed-inner')
      if (inner) inner.style.opacity = ''
    }
    explodedPostcode = null
  }
}

function explodePostcode(record) {
  collapseExploded()
  explodedPostcode = record.postcode

  const entry = activeMarkers.get(record.postcode)
  if (entry) {
    const inner = entry.el.querySelector('.am-collapsed-inner')
    if (inner) inner.style.opacity = '0.55'
  }

  const pupils = []
  for (const cat of ORDERED_CATS) {
    const count = record[cat.toLowerCase()]
    for (let i = 0; i < count; i++) pupils.push(cat)
  }

  const dotSize = pupils.length > 50 ? 8 : pupils.length > 25 ? 10 : 12
  const offsets = spiralOffsets(pupils.length)

  pupils.forEach((cat, idx) => {
    const [ox, oy] = offsets[idx]
    const dotEl = document.createElement('div')
    dotEl.className = 'am-dot'
    dotEl.style.cssText = `width:${dotSize}px;height:${dotSize}px;background:${CATEGORY_COLORS[cat]};`
    dotEl.title = cat

    const m = new maplibregl.Marker({ element: dotEl, offset: [ox, oy], anchor: 'center' })
      .setLngLat([record.lng, record.lat])
      .addTo(map.value)

    explodedMarkers.push(m)
  })
}

// ── LSOA selection ───────────────────────────────────────────────────────────

function clearActiveMarkers() {
  collapseExploded()
  closeDrawer()
  for (const { marker } of activeMarkers.values()) marker.remove()
  activeMarkers.clear()
}

function clearLsoaSelection() {
  if (selectedLsoa.value) {
    map.value.setFeatureState(
      { source: LSOA_SOURCE, id: selectedLsoa.value.featureId },
      { selected: false }
    )
    selectedLsoa.value = null
  }
  clearActiveMarkers()
}

function selectLsoa(feature) {
  // Deselect previous
  if (selectedLsoa.value) {
    map.value.setFeatureState(
      { source: LSOA_SOURCE, id: selectedLsoa.value.featureId },
      { selected: false }
    )
  }
  clearActiveMarkers()

  const code = feature.properties.LSOA21CD
  const name = feature.properties.LSOA21NM
  const featureId = feature.id

  selectedLsoa.value = { code, name, featureId }
  map.value.setFeatureState(
    { source: LSOA_SOURCE, id: featureId },
    { selected: true }
  )

  // Add markers for this LSOA's postcodes
  const postcodes = lsoaPostcodesMap[code] ?? []
  for (const pc of postcodes) {
    const record = postcodeMap.get(pc.toUpperCase())
    if (!record) continue

    const el = makeCollapsedEl(record)
    el.addEventListener('click', e => {
      e.stopPropagation()
      if (explodedPostcode === record.postcode) {
        collapseExploded()
        closeDrawer()
      } else {
        explodePostcode(record)
        openDrawer(record)
      }
    })

    const marker = new maplibregl.Marker({ element: el, anchor: 'center' })
      .setLngLat([record.lng, record.lat])
      .addTo(map.value)

    activeMarkers.set(record.postcode, { marker, el, record })
  }
}

// ── Data loading ─────────────────────────────────────────────────────────────

async function loadData() {
  try {
    // Load geocoded postcode attendance data
    const [attRes, lsoaRes] = await Promise.all([
      fetch('/data/southampton-attendance.json'),
      fetch('/data/lsoa-postcodes.json'),
    ])
    if (!attRes.ok) throw new Error(`HTTP ${attRes.status} loading attendance data`)
    if (!lsoaRes.ok) throw new Error(`HTTP ${lsoaRes.status} loading LSOA postcode data`)

    const records = await attRes.json()
    lsoaPostcodesMap = await lsoaRes.json()

    for (const record of records) {
      postcodeMap.set(record.postcode.toUpperCase(), record)
    }
  } catch (err) {
    errorMsg.value = err.message
  }
}

async function loadLsoaLayer() {
  try {
    const res = await fetch('/geo/southampton-lsoa-pa.geojson')
    if (!res.ok) throw new Error(`HTTP ${res.status} loading LSOA GeoJSON`)
    const geojson = await res.json()

    map.value.addSource(LSOA_SOURCE, {
      type: 'geojson',
      data: geojson,
      generateId: true,
    })

    // Fill — PA% heatmap
    map.value.addLayer({
      id: LSOA_FILL,
      type: 'fill',
      source: LSOA_SOURCE,
      paint: {
        'fill-color': PA_STEP_EXPR,
        'fill-opacity': [
          'case',
          ['boolean', ['feature-state', 'selected'], false], 0.85,
          ['boolean', ['feature-state', 'hover'],    false], 0.75,
          0.6,
        ],
      },
    })

    // Border lines
    map.value.addLayer({
      id: LSOA_LINE,
      type: 'line',
      source: LSOA_SOURCE,
      paint: {
        'line-color': '#9a1051',
        'line-width': 0.7,
        'line-opacity': 0.4,
      },
    })

    // Selected LSOA highlight border
    map.value.addLayer({
      id: LSOA_SELECTED,
      type: 'line',
      source: LSOA_SOURCE,
      paint: {
        'line-color': '#9a1051',
        'line-width': [
          'case',
          ['boolean', ['feature-state', 'selected'], false], 3,
          0,
        ],
        'line-opacity': 1,
      },
    })

    // ── LSOA interactions ────────────────────────────────────────────────────

    let clickedOnLsoa = false

    map.value.on('click', LSOA_FILL, e => {
      clickedOnLsoa = true
      if (e.features && e.features.length > 0) {
        selectLsoa(e.features[0])
      }
    })

    map.value.on('click', () => {
      if (!clickedOnLsoa) {
        clearLsoaSelection()
      }
      clickedOnLsoa = false
    })

    map.value.on('mousemove', LSOA_FILL, e => {
      if (!e.features || e.features.length === 0) return
      const feature = e.features[0]
      const id = feature.id
      if (id !== hoveredFeatureId) {
        if (hoveredFeatureId !== null) {
          map.value.setFeatureState({ source: LSOA_SOURCE, id: hoveredFeatureId }, { hover: false })
        }
        hoveredFeatureId = id
        map.value.setFeatureState({ source: LSOA_SOURCE, id }, { hover: true })
      }
      map.value.getCanvas().style.cursor = 'pointer'

      // Position tooltip offset from cursor so it doesn't obscure the area
      const rect = mapContainer.value.getBoundingClientRect()
      const mx = e.originalEvent.clientX - rect.left
      const my = e.originalEvent.clientY - rect.top
      tooltip.x = mx + 14
      tooltip.y = my - 10
      tooltip.name = feature.properties.LSOA21NM ?? ''
      tooltip.paPercent = feature.properties.paPercent ?? null
      tooltip.visible = true
    })

    map.value.on('mouseleave', LSOA_FILL, () => {
      if (hoveredFeatureId !== null) {
        map.value.setFeatureState({ source: LSOA_SOURCE, id: hoveredFeatureId }, { hover: false })
        hoveredFeatureId = null
      }
      map.value.getCanvas().style.cursor = ''
      tooltip.visible = false
    })
  } catch (err) {
    errorMsg.value = err.message
  }
}

// ── Lifecycle ────────────────────────────────────────────────────────────────

onMounted(() => {
  map.value = new maplibregl.Map({
    container: mapContainer.value,
    style: 'https://tiles.openfreemap.org/styles/positron',
    center: props.center,
    zoom: props.zoom,
  })
  map.value.addControl(new maplibregl.NavigationControl(), 'top-right')

  map.value.on('load', () => {
    // Load attendance data and LSOA layer in parallel.
    // Data will be ready long before a user can click an LSOA.
    loadData()
    loadLsoaLayer()
  })
})

onBeforeUnmount(() => {
  clearActiveMarkers()
  map.value?.remove()
})
</script>

<style scoped>
/* ── Hover tooltip ───────────────────────────────────────────────────────── */

.lam-tooltip {
  position: absolute;
  pointer-events: none;
  z-index: 20;
  background: rgba(20, 20, 30, 0.88);
  color: #fff;
  border-radius: 6px;
  padding: 7px 11px;
  font-family: system-ui, sans-serif;
  font-size: 12px;
  line-height: 1.5;
  white-space: nowrap;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.35);
}

.lam-tooltip-name {
  font-weight: 600;
  margin-bottom: 1px;
}

.lam-tooltip-pa {
  color: #e8c0d4;
  font-size: 11px;
}

.lam-tooltip-pa strong {
  color: #fff;
}

.lam-wrapper {
  position: relative;
  width: 100%;
  height: 750px;
  min-height: 750px;
  overflow: hidden;
}

.map-container {
  width: 100%;
  height: 100%;
}

.map-error {
  position: absolute;
  top: 12px;
  left: 50%;
  transform: translateX(-50%);
  background: #fee;
  border: 1px solid #f66;
  border-radius: 6px;
  padding: 8px 14px;
  font-size: 12px;
  color: #c00;
  pointer-events: none;
}

/* ── Legend ─────────────────────────────────────────────────────────────── */

.lam-legend {
  position: absolute;
  bottom: 28px;
  left: 12px;
  background: rgba(255, 255, 255, 0.97);
  border-radius: 8px;
  padding: 12px 16px;
  box-shadow: 0 2px 10px rgba(0, 0, 0, 0.18);
  font-family: system-ui, sans-serif;
  min-width: 220px;
  pointer-events: none;
}

.legend-title {
  font-size: 11px;
  font-weight: 700;
  text-transform: uppercase;
  letter-spacing: 0.06em;
  color: #555;
  margin-bottom: 9px;
}

.legend-subtitle {
  font-size: 11px;
  color: #888;
  margin-top: 4px;
}

.legend-row {
  display: flex;
  align-items: center;
  gap: 8px;
  margin-bottom: 5px;
}

.legend-dot {
  width: 12px;
  height: 12px;
  border-radius: 50%;
  flex-shrink: 0;
  border: 1px solid rgba(0, 0, 0, 0.12);
}

.legend-label {
  font-size: 12px;
  color: #444;
}

.legend-divider {
  border-top: 1px solid #eee;
  margin: 8px 0;
}

.legend-hint {
  font-size: 11px;
  color: #999;
  line-height: 1.4;
}

/* PA scale bar */
.lam-scale {
  margin-bottom: 4px;
}

.lam-scale-bar {
  display: flex;
  height: 14px;
  border-radius: 3px;
  overflow: hidden;
  border: 1px solid rgba(0, 0, 0, 0.1);
}

.lam-scale-step {
  flex: 1;
}

.lam-scale-labels {
  display: flex;
  justify-content: space-between;
  font-size: 10px;
  color: #888;
  margin-top: 2px;
}

/* Selected LSOA info */
.lam-selected-info {
  display: flex;
  flex-direction: column;
  gap: 3px;
}

.lam-selected-name {
  font-size: 12px;
  font-weight: 700;
  color: #9a1051;
}

/* ── Drawer (identical styles to AttendanceMap) ──────────────────────────── */

.am-drawer {
  position: absolute;
  top: 0;
  right: 0;
  width: 320px;
  height: 100%;
  background: #f0f3f7;
  z-index: 10;
  display: flex;
  flex-direction: column;
  box-shadow: -4px 0 20px rgba(0, 0, 0, 0.18);
  font-family: 'Open Sans', system-ui, sans-serif;
}

.am-drawer-enter-active,
.am-drawer-leave-active {
  transition: transform 0.25s ease;
}
.am-drawer-enter-from,
.am-drawer-leave-to {
  transform: translateX(100%);
}

.am-drawer-header {
  display: flex;
  align-items: center;
  gap: 8px;
  background: #e1e8ee;
  padding: 14px 16px;
  border-bottom: 1px solid #c8d4de;
  flex-shrink: 0;
}

.am-drawer-header--detail {
  gap: 6px;
}

.am-drawer-title {
  font-size: 14px;
  font-weight: 700;
  color: #2c3e4f;
  flex: 1;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}

.am-drawer-close {
  background: none;
  border: none;
  cursor: pointer;
  font-size: 16px;
  color: #606877;
  line-height: 1;
  padding: 2px 4px;
  flex-shrink: 0;
}
.am-drawer-close:hover { color: #2c3e4f; }

.am-drawer-back {
  background: none;
  border: none;
  cursor: pointer;
  font-size: 20px;
  color: #606877;
  line-height: 1;
  padding: 0 4px 0 0;
  flex-shrink: 0;
}
.am-drawer-back:hover { color: #2c3e4f; }

.am-drawer-body {
  flex: 1;
  overflow-y: auto;
}

.am-legend-strip {
  display: flex;
  align-items: center;
  gap: 6px;
  padding: 8px 14px;
  background: #fff;
  border-bottom: 1px solid #dde4eb;
  font-size: 11px;
  color: #606877;
}

.am-ls-swatch {
  width: 28px;
  height: 6px;
  border-radius: 2px;
  flex-shrink: 0;
}
.am-ls-swatch--att    { background: #9cb8cd; }
.am-ls-swatch--auth   { background: rgba(130, 80, 170, 0.5); }
.am-ls-swatch--unauth { background: #8250aa; }

.am-ls-label { margin-right: 6px; }

.am-col-headers {
  display: flex;
  justify-content: space-between;
  padding: 7px 14px;
  font-size: 10px;
  font-weight: 700;
  letter-spacing: 0.06em;
  color: #606877;
  background: #e8edf2;
  border-bottom: 1px solid #dde4eb;
  position: sticky;
  top: 0;
}

.am-pupil-row {
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 10px 14px 0;
  background: #fff;
  cursor: pointer;
  border-bottom: 1px solid #edf1f4;
  transition: background 0.12s;
}
.am-pupil-row:hover { background: #f5f8fa; }

.am-pupil-dot {
  width: 10px;
  height: 10px;
  border-radius: 50%;
  flex-shrink: 0;
  border: 1px solid rgba(0, 0, 0, 0.1);
}
.am-pupil-dot--lg {
  width: 14px;
  height: 14px;
}

.am-pupil-info {
  flex: 1;
  min-width: 0;
  padding-bottom: 10px;
}

.am-pupil-name {
  font-size: 13px;
  font-weight: 700;
  color: #2c3e4f;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}

.am-pupil-school {
  font-size: 11px;
  font-style: italic;
  color: #606877;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
  margin-top: 1px;
  margin-bottom: 5px;
}

.am-mini-bar {
  height: 4px;
  background: #dde4eb;
  border-radius: 2px;
  display: flex;
  overflow: hidden;
}
.am-mb-att    { background: #9cb8cd; height: 100%; }
.am-mb-auth   { background: rgba(130, 80, 170, 0.5); height: 100%; }
.am-mb-unauth { background: #8250aa; height: 100%; }

.am-pupil-pct {
  font-size: 13px;
  font-weight: 700;
  color: #2c3e4f;
  flex-shrink: 0;
}

.am-chevron {
  font-size: 18px;
  color: #9aaab8;
  flex-shrink: 0;
  line-height: 1;
}

.am-detail-hero {
  display: flex;
  align-items: center;
  gap: 10px;
  padding: 16px 14px;
  background: #fff;
  border-bottom: 1px solid #dde4eb;
}

.am-detail-meta {
  display: flex;
  flex-direction: column;
  gap: 4px;
  padding: 12px 14px;
  background: #fff;
  border-bottom: 1px solid #dde4eb;
  font-size: 12px;
}

.am-meta-label {
  color: #606877;
  margin-right: 6px;
}
.am-meta-val {
  color: #2c3e4f;
  font-weight: 600;
}

.am-stats-grid {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 1px;
  background: #dde4eb;
  border-top: 1px solid #dde4eb;
  border-bottom: 1px solid #dde4eb;
  margin-top: 12px;
}

.am-stat {
  background: #fff;
  padding: 10px 14px;
}

.am-stat-label {
  font-size: 10px;
  font-weight: 700;
  letter-spacing: 0.05em;
  color: #606877;
  text-transform: uppercase;
  margin-bottom: 3px;
}

.am-stat-val {
  font-size: 13px;
  font-weight: 600;
  color: #2c3e4f;
}

.am-att-section {
  padding: 16px 14px;
  background: #fff;
  margin-top: 12px;
  border-top: 1px solid #dde4eb;
  border-bottom: 1px solid #dde4eb;
}

.am-att-section-title {
  font-size: 10px;
  font-weight: 700;
  letter-spacing: 0.08em;
  color: #606877;
  text-transform: uppercase;
  margin-bottom: 10px;
}

.am-att-overall {
  font-size: 32px;
  font-weight: 700;
  color: #2c3e4f;
  line-height: 1;
}

.am-att-overall-label {
  font-size: 12px;
  color: #606877;
  margin-top: 3px;
  margin-bottom: 14px;
}

.am-att-gap {
  display: flex;
  justify-content: space-between;
  align-items: center;
  font-size: 12px;
  border-top: 1px solid #edf1f4;
  padding-top: 10px;
}

.am-neg { color: #c0392b; font-weight: 700; }
.am-pos { color: #27ae60; font-weight: 700; }
</style>

<!-- Global styles for MapLibre marker elements (unscoped) -->
<style>
.am-collapsed { cursor: pointer; }

.am-collapsed-inner {
  filter: drop-shadow(0 2px 3px rgba(0, 0, 0, 0.3));
  transition: transform 0.15s ease, opacity 0.25s ease;
}

.am-collapsed:hover .am-collapsed-inner {
  transform: scale(1.12);
}

.am-dot {
  border-radius: 50%;
  border: 1.5px solid rgba(255, 255, 255, 0.85);
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.35);
  pointer-events: none;
}
</style>
