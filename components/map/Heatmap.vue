<template>
  <div class="map-wrapper">
    <div ref="mapContainer" class="map-container"></div>
    <pre v-if="errorMsg" class="map-error">{{ errorMsg }}</pre>
    <Drawer :direction="'right'" :isOpen="isOpen" class="layout-drawer">
      <template #header>
        <div class="judgement-drawer__header">
          <h1>{{ selectedIcon?.title || 'No selection' }}</h1>
          <span class="entypo--cancel-circled ml-auto" @click="closeDrawer"></span>
        </div>
        <div>
          <span>Id: {{ selectedIcon?.id || 'No selection' }}</span><br />
          <span>Category: {{ selectedIcon?.cat || 'N/A' }}</span><br />
          <span v-if="selectedIcon?.isDuplicate">Duplicate stack: yes</span>
        </div>
      </template>
    </Drawer>
  </div>
</template>

<script setup>
import { ref, onMounted, onBeforeUnmount } from 'vue'
import maplibregl from 'maplibre-gl'
import 'maplibre-gl/dist/maplibre-gl.css'
import Drawer from '../Drawer.vue'

const STACK_COUNT = 4
const STACK_COORDS = [-2.9916, 53.4084]
const STACK_ONLY = false
const STACK_TITLE_PREFIX = 'Stacked point'

const HEATMAP_MAX_ZOOM = 8.5
const POINTS_MIN_ZOOM = 8.5

const mapContainer = ref(null)
const map = ref(null)
const errorMsg = ref('')

const styleUrl = 'https://tiles.openfreemap.org/styles/positron'
const sourceId = 'points'

const selectedIcon = ref(null)
const isOpen = ref(false)

function openDrawer(payload) {
  selectedIcon.value = payload
  isOpen.value = true
}

function closeDrawer() {
  isOpen.value = false
  selectedIcon.value = null
}

function jitterCoord([lng, lat], metres = 800) {
  const r = metres / 111320
  const u = Math.random() - 0.5
  const v = Math.random() - 0.5
  return [lng + (u * r) / Math.cos((lat * Math.PI) / 180), lat + v * r]
}

function makeFakeFeatures({
  centre = STACK_COORDS,
  count = 250,
  stackAt = STACK_COORDS,
  stackCount = STACK_COUNT,
  stackOnly = STACK_ONLY
} = {}) {
  const cats = ['A', 'B', 'C', 'D']
  const features = []

  for (let i = 0; i < stackCount; i++) {
    const cat = cats[i % cats.length]
    features.push({
      type: 'Feature',
      properties: { id: `stack-${i}`, cat, isDuplicate: true, title: `${STACK_TITLE_PREFIX} ${i + 1}` },
      geometry: { type: 'Point', coordinates: stackAt }
    })
  }

  if (stackOnly) return { type: 'FeatureCollection', features }

  for (let i = 0; i < count; i++) {
    const coords = jitterCoord(centre, 2500)
    const cat = cats[Math.floor(Math.random() * cats.length)]
    features.push({
      type: 'Feature',
      properties: { id: `p-${i}`, cat, title: `Point ${i}` },
      geometry: { type: 'Point', coordinates: coords }
    })
  }

  return { type: 'FeatureCollection', features }
}

onMounted(() => {
  try {
    map.value = new maplibregl.Map({
      container: mapContainer.value,
      style: styleUrl,
      center: STACK_COORDS,
      zoom: 5,
      minZoom: 4,
      maxZoom: 17
    })

    map.value.dragRotate.disable()
    map.value.addControl(new maplibregl.NavigationControl({ showCompass: false }), 'top-left')

    map.value.on('load', () => {
      errorMsg.value = ''

      const data = makeFakeFeatures({
        centre: STACK_COORDS,
        count: 700,
        stackAt: STACK_COORDS,
        stackCount: STACK_COUNT,
        stackOnly: STACK_ONLY
      })

      map.value.addSource(sourceId, {
        type: 'geojson',
        data
      })

      map.value.addLayer({
        id: 'points-heat',
        type: 'heatmap',
        source: sourceId,
        maxzoom: HEATMAP_MAX_ZOOM,
        paint: {
          'heatmap-weight': [
            'interpolate',
            ['linear'],
            ['zoom'],
            0, 0.5,
            10, 1
          ],
          'heatmap-intensity': [
            'interpolate',
            ['linear'],
            ['zoom'],
            0, 0.8,
            10, 1.6
          ],
          'heatmap-radius': [
            'interpolate',
            ['linear'],
            ['zoom'],
            0, 10,
            6, 24,
            10, 40
          ],
          'heatmap-opacity': [
            'interpolate',
            ['linear'],
            ['zoom'],
            0, 0.9,
            HEATMAP_MAX_ZOOM, 0
          ]
        }
      })

      map.value.addLayer({
        id: 'points-circle',
        type: 'circle',
        source: sourceId,
        minzoom: POINTS_MIN_ZOOM,
        paint: {
          'circle-radius': [
            'interpolate',
            ['linear'],
            ['zoom'],
            POINTS_MIN_ZOOM, 4,
            12, 7,
            16, 10
          ],
          'circle-color': [
            'match',
            ['get', 'cat'],
            'A', '#21529A',
            'B', '#43972A',
            'C', '#D4732D',
            '#B02418'
          ],
          'circle-stroke-color': '#111',
          'circle-stroke-width': 1,
          'circle-opacity': 0.95
        }
      })

      map.value.on('mouseenter', 'points-circle', () => {
        if (!map.value) return
        map.value.getCanvas().style.cursor = 'pointer'
      })

      map.value.on('mouseleave', 'points-circle', () => {
        if (!map.value) return
        map.value.getCanvas().style.cursor = ''
      })

      map.value.on('click', 'points-circle', (e) => {
        const f = e?.features?.[0]
        if (!f) return
        openDrawer({
          id: f?.properties?.id,
          cat: f?.properties?.cat,
          isDuplicate: f?.properties?.isDuplicate === true || f?.properties?.isDuplicate === 'true',
          title: f?.properties?.title || 'Marker'
        })
      })

      map.value.on('click', (e) => {
        const features = map.value.queryRenderedFeatures(e.point, { layers: ['points-circle'] })
        if (features?.length) return
        closeDrawer()
      })
    })

    map.value.on('error', (e) => {
      const err = e?.error || e
      const message = [
        'MapLibre error event:',
        err?.message || String(err),
        err?.status ? `status: ${err.status}` : '',
        err?.url ? `url: ${err.url}` : ''
      ].filter(Boolean).join('\n')
      errorMsg.value = message
      console.error('MapLibre error:', e)
    })
  } catch (e) {
    errorMsg.value = `Map init failed: ${e?.message || String(e)}`
    console.error(e)
  }
})

onBeforeUnmount(() => {
  if (map.value) {
    try { map.value.remove() } catch (e) {}
    map.value = null
  }
})
</script>

<style>
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

.map-error {
  position: absolute;
  left: 12px;
  bottom: 12px;
  right: 12px;
  max-height: 45%;
  overflow: auto;
  background: rgba(255,255,255,0.95);
  border: 1px solid #ddd;
  padding: 10px;
  font-size: 12px;
  line-height: 1.4;
  white-space: pre-wrap;
}
</style>
