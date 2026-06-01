<template>
  <div class="map-wrapper" :style="{ height: mapHeight, minHeight: mapMinHeight }">
    <div ref="mapContainer" class="map-container"></div>

    <Transition name="loader-fade">
      <div v-if="loading" class="map-loader">
        <div class="map-loader__label">Loading LSOA boundaries…</div>
        <div class="map-loader__track">
          <div class="map-loader__bar" :style="{ width: loadProgress + '%' }"></div>
        </div>
        <div class="map-loader__pct">{{ loadProgress }}%</div>
      </div>
    </Transition>

    <pre v-if="errorMsg" class="map-error">{{ errorMsg }}</pre>

    <!-- Info panel shown on click -->
    <Transition name="panel-slide">
      <div v-if="selectedFeature" class="lsoa-info-panel">
        <div class="lsoa-info-panel__header">
          <div>
            <div class="lsoa-info-panel__code">{{ selectedFeature.LSOA21CD }}</div>
            <div class="lsoa-info-panel__name">{{ selectedFeature.LSOA21NM }}</div>
          </div>
          <button class="lsoa-info-panel__close" @click="selectedFeature = null">✕</button>
        </div>

        <div class="lsoa-info-panel__body">
          <div class="lsoa-info-panel__stat lsoa-info-panel__stat--highlight">
            <span class="lsoa-info-panel__stat-label">Attendance</span>
            <span class="lsoa-info-panel__stat-value">{{ selectedFeature.Attendance_Perc != null ? selectedFeature.Attendance_Perc.toFixed(1) + '%' : '—' }}</span>
          </div>
          <div class="lsoa-info-panel__stat">
            <span class="lsoa-info-panel__stat-label">Total Children</span>
            <span class="lsoa-info-panel__stat-value">{{ selectedFeature.TotalChildren ?? '—' }}</span>
          </div>
          <div class="lsoa-info-panel__stat">
            <span class="lsoa-info-panel__stat-label">Coordinates</span>
            <span class="lsoa-info-panel__stat-value">{{ selectedFeature.LAT?.toFixed(5) }}, {{ selectedFeature.LONG?.toFixed(5) }}</span>
          </div>

          <div class="lsoa-info-panel__divider"></div>

          <div
            v-for="(val, key) in selectedFeatureExtra"
            :key="key"
            class="lsoa-info-panel__stat"
          >
            <span class="lsoa-info-panel__stat-label">{{ key }}</span>
            <span class="lsoa-info-panel__stat-value">{{ val ?? '—' }}</span>
          </div>
        </div>
      </div>
    </Transition>

    <!-- Layer toggle -->
    <label class="lsoa-layer-toggle" :title="lsoaVisible ? 'Hide LSOA layer' : 'Show LSOA layer'">
      <span class="lsoa-layer-toggle__label">LSOA layer</span>
      <span class="lsoa-layer-toggle__track" :class="{ 'lsoa-layer-toggle__track--on': lsoaVisible }" @click="toggleLSOALayer">
        <span class="lsoa-layer-toggle__thumb"></span>
      </span>
    </label>

    <!-- Hover tooltip -->
    <div
      v-if="hoveredFeature"
      class="lsoa-tooltip"
      :style="{ left: tooltipPos.x + 'px', top: tooltipPos.y + 'px' }"
    >
      {{ hoveredFeature.LSOA21NM || hoveredFeature.LSOA }}
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted, onBeforeUnmount } from 'vue'
import maplibregl from 'maplibre-gl'
import 'maplibre-gl/dist/maplibre-gl.css'

const props = defineProps({
  /** Initial map center [lng, lat] */
  center: {
    type: Array,
    default: () => [-1.5, 52.5]
  },
  /** Initial zoom level */
  zoom: {
    type: Number,
    default: 6
  },
  /** Fill colour for LSOA polygons */
  fillColor: {
    type: String,
    default: '#4a90d9'
  },
  /** Outline colour */
  lineColor: {
    type: String,
    default: '#2c6fad'
  },
  /** Fill opacity (0–1) */
  fillOpacity: {
    type: Number,
    default: 0.85
  },
  /** Override the LSOA GeoJSON URL — useful when deploying to a CDN */
  geojsonUrl: {
    type: String,
    default: './geo/southampton_lsoa.geojson'
  },
  /** Filter fitBounds to features whose LSOA21NM contains this string. Null fits all features. */
  fitArea: {
    type: String,
    default: 'Southampton'
  },
  /** When true, colours each feature using its attendance_colour property instead of fillColor */
  useAttendanceColour: {
    type: Boolean,
    default: true
  },
  /** Override the map wrapper height (any CSS value) */
  mapHeight: {
    type: String,
    default: '750px'
  },
  /** Override the map wrapper min-height (any CSS value) */
  mapMinHeight: {
    type: String,
    default: '750px'
  },
  /** Show the built-in click info panel. Set false to handle selection externally via the select event. */
  showPanel: {
    type: Boolean,
    default: true
  }
})

const emit = defineEmits(['select', 'deselect'])

const mapContainer = ref(null)
const map = ref(null)
const errorMsg = ref('')
const loading = ref(false)
const loadProgress = ref(0)

const selectedFeature = ref(null)
const hoveredFeature = ref(null)
const tooltipPos = ref({ x: 0, y: 0 })
const lsoaVisible = ref(true)

// Keys shown as dedicated stats — everything else goes in the "extra" section
const PRIMARY_KEYS = new Set(['FID', 'LSOA21CD', 'LSOA21NM', 'LSOA21NMW', 'LAT', 'LONG', 'Attendance_Perc', 'TotalChildren', 'attendance_colour', 'GlobalID', 'LSOA'])

const selectedFeatureExtra = computed(() => {
  if (!selectedFeature.value) return {}
  return Object.fromEntries(
    Object.entries(selectedFeature.value).filter(([k]) => !PRIMARY_KEYS.has(k))
  )
})

let hoveredId = null

function toggleLSOALayer() {
  if (!map.value) return
  lsoaVisible.value = !lsoaVisible.value
  const visibility = lsoaVisible.value ? 'visible' : 'none'
  map.value.setLayoutProperty(FILL_LAYER, 'visibility', visibility)
  map.value.setLayoutProperty(LINE_LAYER, 'visibility', visibility)
  if (!lsoaVisible.value) {
    hoveredFeature.value = null
    if (hoveredId !== null) {
      map.value.setFeatureState({ source: SOURCE_ID, id: hoveredId }, { hover: false })
      hoveredId = null
    }
  }
}

const styleUrl = 'https://tiles.openfreemap.org/styles/bright'
const SOURCE_ID = 'lsoa-source'
const FILL_LAYER = 'lsoa-fill'
const FILL_HOVER_LAYER = 'lsoa-fill-hover'
const LINE_LAYER = 'lsoa-line'

async function loadLSOA() {
  loading.value = true
  loadProgress.value = 0
  try {
    const response = await fetch(props.geojsonUrl)
    if (!response.ok) throw new Error(`Failed to fetch LSOA.geojson: ${response.status}`)

    const contentLength = response.headers.get('Content-Length')
    const total = contentLength ? parseInt(contentLength, 10) : null

    const reader = response.body.getReader()
    const chunks = []
    let received = 0

    while (true) {
      const { done, value } = await reader.read()
      if (done) break
      chunks.push(value)
      received += value.length
      if (total) {
        loadProgress.value = Math.min(Math.round((received / total) * 100), 99)
      }
    }

    // Combine chunks and parse
    const all = new Uint8Array(received)
    let offset = 0
    for (const chunk of chunks) {
      all.set(chunk, offset)
      offset += chunk.length
    }
    const text = new TextDecoder().decode(all)
    loadProgress.value = 100
    return JSON.parse(text)
  } catch (err) {
    errorMsg.value = `Could not load LSOA data: ${err.message}`
    return null
  } finally {
    // Brief pause so the 100% state is visible before the bar disappears
    setTimeout(() => { loading.value = false }, 400)
  }
}

function setupLayers(geojson) {
  if (!map.value || !geojson) return

  // Assign numeric feature IDs so MapLibre can track hover state
  if (geojson.features) {
    geojson.features.forEach((f, i) => { f.id = i })
  }

  map.value.addSource(SOURCE_ID, {
    type: 'geojson',
    data: geojson,
    generateId: false // we set IDs above
  })

  // Base fill layer
  map.value.addLayer({
    id: FILL_LAYER,
    type: 'fill',
    source: SOURCE_ID,
    paint: {
      'fill-color': props.useAttendanceColour
        ? [
            'interpolate',
            ['linear'],
            ['get', 'Attendance_Perc'],
            0,  '#67000d',
            87, '#cb181d',
            91, '#fc8d59',
            94, '#fdcc8a',
            97, '#a6d96a',
            100, '#1a7837'
          ]
        : props.fillColor,
      'fill-opacity': [
        'case',
        ['boolean', ['feature-state', 'hover'], false],
        Math.min(props.fillOpacity + 0.3, 0.85),
        props.fillOpacity
      ]
    }
  })

  // Outline layer
  map.value.addLayer({
    id: LINE_LAYER,
    type: 'line',
    source: SOURCE_ID,
    paint: {
      'line-color': props.lineColor,
      'line-width': [
        'case',
        ['boolean', ['feature-state', 'hover'], false],
        2,
        0.5
      ],
      'line-opacity': 0.8
    }
  })

  // Hover interaction
  map.value.on('mousemove', FILL_LAYER, (e) => {
    if (!e.features?.length) return

    map.value.getCanvas().style.cursor = 'pointer'

    const feature = e.features[0]
    const id = feature.id

    if (hoveredId !== null && hoveredId !== id) {
      map.value.setFeatureState({ source: SOURCE_ID, id: hoveredId }, { hover: false })
    }

    hoveredId = id
    map.value.setFeatureState({ source: SOURCE_ID, id: hoveredId }, { hover: true })

    hoveredFeature.value = feature.properties
    tooltipPos.value = { x: e.point.x + 12, y: e.point.y - 8 }
  })

  map.value.on('mouseleave', FILL_LAYER, () => {
    map.value.getCanvas().style.cursor = ''
    if (hoveredId !== null) {
      map.value.setFeatureState({ source: SOURCE_ID, id: hoveredId }, { hover: false })
      hoveredId = null
    }
    hoveredFeature.value = null
  })

  // Click to select
  map.value.on('click', FILL_LAYER, (e) => {
    if (!e.features?.length) return
    const raw = e.features[0].properties
    // MapLibre serialises properties — coerce numeric fields back
    const feature = {
      ...raw,
      Attendance_Perc: raw.Attendance_Perc != null ? Number(raw.Attendance_Perc) : null,
      TotalChildren:   raw.TotalChildren   != null ? Number(raw.TotalChildren)   : null,
      LAT:             raw.LAT             != null ? Number(raw.LAT)             : null,
      LONG:            raw.LONG            != null ? Number(raw.LONG)            : null,
    }
    if (props.showPanel) selectedFeature.value = feature
    emit('select', feature)
  })

  // Click on blank map to deselect
  map.value.on('click', (e) => {
    const features = map.value.queryRenderedFeatures(e.point, { layers: [FILL_LAYER] })
    if (!features.length) {
      selectedFeature.value = null
      emit('deselect')
    }
  })
}

function fitToBounds(geojson) {
  if (!map.value || !geojson?.features?.length) return
  let minLng = Infinity, maxLng = -Infinity, minLat = Infinity, maxLat = -Infinity
  function scan(coords) {
    coords.forEach(c => {
      if (Array.isArray(c[0])) scan(c)
      else {
        if (c[0] < minLng) minLng = c[0]
        if (c[0] > maxLng) maxLng = c[0]
        if (c[1] < minLat) minLat = c[1]
        if (c[1] > maxLat) maxLat = c[1]
      }
    })
  }
  const features = props.fitArea
    ? geojson.features.filter(f => f.properties?.LSOA21NM?.includes(props.fitArea))
    : geojson.features
  const target = features.length ? features : geojson.features
  target.forEach(f => scan(f.geometry.coordinates))
  if (!isFinite(minLng)) return
  map.value.fitBounds([[minLng, minLat], [maxLng, maxLat]], { padding: 80, duration: 0, maxZoom: 10 })
}

onMounted(() => {
  try {
    map.value = new maplibregl.Map({
      container: mapContainer.value,
      style: styleUrl,
      center: props.center,
      zoom: props.zoom,
      minZoom: 4,
      maxZoom: 18
    })

    map.value.dragRotate.disable()
    map.value.addControl(new maplibregl.NavigationControl({ showCompass: false }), 'top-left')

    map.value.on('load', async () => {
      const geojson = await loadLSOA()
      if (!geojson) return
      setupLayers(geojson)
      fitToBounds(geojson)
    })

    map.value.on('error', (e) => {
      const err = e?.error || e
      errorMsg.value = `${err?.message || String(err)}`
      console.error('MapLibre error:', e)
    })
  } catch (e) {
    errorMsg.value = `Map init failed: ${e?.message || String(e)}`
    console.error('Mount error:', e)
  }
})

onBeforeUnmount(() => {
  if (map.value) {
    try { map.value.remove() } catch (_) {}
    map.value = null
  }
})
</script>

<style scoped>
.map-wrapper {
  position: relative;
  width: 100%;
  height: 750px;
  min-height: 750px;
}

.map-container {
  width: 100%;
  height: 100%;
}

.map-loader {
  position: absolute;
  bottom: 32px;
  left: 50%;
  transform: translateX(-50%);
  background: white;
  border: 1px solid #ddd;
  border-radius: 8px;
  padding: 14px 20px;
  min-width: 260px;
  box-shadow: 0 4px 16px rgba(0, 0, 0, 0.1);
  z-index: 1000;
  pointer-events: none;
  text-align: center;
}

.map-loader__label {
  font-size: 13px;
  font-weight: 500;
  color: #444;
  margin-bottom: 10px;
}

.map-loader__track {
  height: 6px;
  background: #eaeaea;
  border-radius: 99px;
  overflow: hidden;
  margin-bottom: 7px;
}

.map-loader__bar {
  height: 100%;
  background: linear-gradient(90deg, #4a7fa8, #7aaac8);
  border-radius: 99px;
  transition: width 0.15s ease-out;
}

.map-loader__pct {
  font-size: 11px;
  color: #888;
}

.loader-fade-enter-active,
.loader-fade-leave-active {
  transition: opacity 0.3s ease, transform 0.3s ease;
}

.loader-fade-enter-from,
.loader-fade-leave-to {
  opacity: 0;
  transform: translateX(-50%) translateY(8px);
}

.map-error {
  position: absolute;
  left: 12px;
  bottom: 12px;
  right: 12px;
  max-height: 45%;
  overflow: auto;
  background: rgba(255, 255, 255, 0.95);
  border: 1px solid #ddd;
  padding: 10px;
  font-size: 12px;
  line-height: 1.4;
  white-space: pre-wrap;
  z-index: 1000;
}

.lsoa-info-panel {
  position: absolute;
  top: 0;
  right: 0;
  bottom: 0;
  width: 300px;
  background: white;
  border-left: 1px solid #ddd;
  box-shadow: -4px 0 16px rgba(0, 0, 0, 0.1);
  z-index: 1000;
  display: flex;
  flex-direction: column;
  overflow: hidden;
}

.lsoa-info-panel__header {
  display: flex;
  align-items: flex-start;
  justify-content: space-between;
  padding: 16px;
  border-bottom: 1px solid #eee;
  flex-shrink: 0;
}

.lsoa-info-panel__close {
  background: none;
  border: none;
  cursor: pointer;
  font-size: 16px;
  color: #888;
  padding: 0;
  line-height: 1;
  flex-shrink: 0;
  margin-left: 8px;
  margin-top: 2px;
}

.lsoa-info-panel__close:hover {
  color: #333;
}

.lsoa-info-panel__code {
  font-size: 11px;
  font-weight: 600;
  color: #888;
  text-transform: uppercase;
  letter-spacing: 0.05em;
  margin-bottom: 4px;
}

.lsoa-info-panel__name {
  font-size: 15px;
  font-weight: 600;
  color: #222;
  line-height: 1.3;
}

.lsoa-info-panel__body {
  flex: 1;
  overflow-y: auto;
  padding: 12px 16px;
  display: flex;
  flex-direction: column;
  gap: 2px;
}

.lsoa-info-panel__stat {
  display: flex;
  justify-content: space-between;
  align-items: baseline;
  padding: 7px 0;
  border-bottom: 1px solid #f2f2f2;
  gap: 12px;
}

.lsoa-info-panel__stat--highlight {
  background: #f7f3ff;
  margin: 0 -16px;
  padding: 10px 16px;
  border-bottom: 1px solid #e8dff5;
}

.lsoa-info-panel__stat-label {
  font-size: 12px;
  color: #666;
  flex-shrink: 0;
}

.lsoa-info-panel__stat-value {
  font-size: 13px;
  font-weight: 600;
  color: #222;
  text-align: right;
}

.lsoa-info-panel__divider {
  height: 1px;
  background: #eee;
  margin: 8px 0;
}

.panel-slide-enter-active,
.panel-slide-leave-active {
  transition: transform 0.25s ease;
}

.panel-slide-enter-from,
.panel-slide-leave-to {
  transform: translateX(100%);
}

.lsoa-layer-toggle {
  position: absolute;
  top: 54px;
  left: 10px;
  display: flex;
  align-items: center;
  gap: 8px;
  background: white;
  border: 1px solid #ddd;
  border-radius: 6px;
  padding: 7px 10px;
  font-size: 12px;
  font-weight: 500;
  color: #444;
  box-shadow: 0 2px 6px rgba(0, 0, 0, 0.1);
  z-index: 1000;
  user-select: none;
  cursor: default;
}

.lsoa-layer-toggle__label {
  white-space: nowrap;
}

.lsoa-layer-toggle__track {
  position: relative;
  width: 36px;
  height: 20px;
  border-radius: 99px;
  background: #ccc;
  cursor: pointer;
  flex-shrink: 0;
  transition: background 0.2s;
}

.lsoa-layer-toggle__track--on {
  background: #4a90d9;
}

.lsoa-layer-toggle__thumb {
  position: absolute;
  top: 2px;
  left: 2px;
  width: 16px;
  height: 16px;
  border-radius: 50%;
  background: white;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.25);
  transition: transform 0.2s;
}

.lsoa-layer-toggle__track--on .lsoa-layer-toggle__thumb {
  transform: translateX(16px);
}

.lsoa-tooltip {
  position: absolute;
  background: rgba(30, 30, 30, 0.85);
  color: white;
  padding: 5px 10px;
  border-radius: 4px;
  font-size: 12px;
  pointer-events: none;
  z-index: 2000;
  white-space: nowrap;
  transform: translateY(-100%);
}
</style>
