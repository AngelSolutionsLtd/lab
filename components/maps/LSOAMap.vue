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
    <div v-if="selectedFeature" class="lsoa-info-panel">
      <button class="lsoa-info-panel__close" @click="selectedFeature = null">✕</button>
      <div class="lsoa-info-panel__code">{{ selectedFeature.LSOA21CD }}</div>
      <div class="lsoa-info-panel__name">{{ selectedFeature.LSOA21NM }}</div>
      <div class="lsoa-info-panel__coords">
        <span>{{ selectedFeature.LAT?.toFixed(5) }}, {{ selectedFeature.LONG?.toFixed(5) }}</span>
      </div>
    </div>

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
      {{ hoveredFeature.LSOA21NM }}
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted, onBeforeUnmount } from 'vue'
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
    default: 0.25
  },
  /** Override the LSOA GeoJSON URL — useful when deploying to a CDN */
  geojsonUrl: {
    type: String,
    default: './geo/LSOA.geojson'
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
      'fill-color': props.fillColor,
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
    const feature = e.features[0].properties
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
      if (geojson) setupLayers(geojson)
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
  top: 12px;
  right: 12px;
  background: white;
  border: 1px solid #ddd;
  border-radius: 6px;
  padding: 14px 16px;
  min-width: 200px;
  max-width: 280px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.12);
  z-index: 1000;
}

.lsoa-info-panel__close {
  position: absolute;
  top: 8px;
  right: 10px;
  background: none;
  border: none;
  cursor: pointer;
  font-size: 14px;
  color: #888;
  padding: 0;
  line-height: 1;
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
  margin-bottom: 6px;
  padding-right: 20px;
}

.lsoa-info-panel__coords {
  font-size: 12px;
  color: #666;
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
