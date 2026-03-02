<template>
  <div class="map-wrapper">
    <div ref="mapContainer" class="map-container"></div>
    <pre v-if="errorMsg" class="map-error">{{ errorMsg }}</pre>
  </div>
</template>

<script setup>
import { ref, onMounted, onBeforeUnmount, watch, createApp, h } from 'vue'
import maplibregl from 'maplibre-gl'
import 'maplibre-gl/dist/maplibre-gl.css'
import Marker from './Marker.vue'

const props = defineProps({
  markers: { type: Array, default: () => [] }
})

const mapContainer = ref(null)
const map = ref(null)
const errorMsg = ref('')

const styleUrl = 'https://tiles.openfreemap.org/styles/positron'

// id -> { marker: MapLibreMarker, app: VueApp, el: HTMLElement }
const mapMarkers = new Map()

function addOrUpdateMarker(markerData) {
  if (!map.value) return
  const id = markerData.id ?? JSON.stringify([markerData.lat, markerData.lng])

  if (mapMarkers.has(id)) {
    // update position only
    mapMarkers.get(id).marker.setLngLat([markerData.lng, markerData.lat])
    return
  }

  const el = document.createElement('div')

  const app = createApp({
    render() {
      return h(Marker, {
        rollSize: markerData.rollSize ?? 'sm',
        balance: markerData.balance ?? 'neutral',
        phase: markerData.phase ?? 'A',
        hexColor: markerData.hexColor ?? '#698BAB',
        opacity: markerData.opacity ?? 1,
        isSpecial: markerData.isSpecial ?? false
      })
    }
  })
  app.mount(el)

  const mlMarker = new maplibregl.Marker({ element: el, anchor: 'bottom' })
    .setLngLat([markerData.lng, markerData.lat])
    .addTo(map.value)

  mapMarkers.set(id, { marker: mlMarker, app, el })
}

function removeMarkerById(id) {
  const entry = mapMarkers.get(id)
  if (!entry) return
  try {
    entry.marker.remove()
    entry.app.unmount()
  } catch (e) {}
  mapMarkers.delete(id)
}

function syncMarkers() {
  if (!map.value) return

  const incomingIds = new Set(props.markers.map(m => m.id ?? JSON.stringify([m.lat, m.lng])))

  for (const existingId of Array.from(mapMarkers.keys())) {
    if (!incomingIds.has(existingId)) removeMarkerById(existingId)
  }

  for (const m of props.markers) {
    addOrUpdateMarker(m)
  }
}

onMounted(() => {
  try {
    map.value = new maplibregl.Map({
      container: mapContainer.value,
      style: styleUrl,
      center: [-2.9916, 53.4084],
      zoom: 12,
      minZoom: 5,
      maxZoom: 16
    })

    map.value.dragRotate.disable()
    map.value.addControl(new maplibregl.NavigationControl({ showCompass: false }), 'top-left')

    map.value.on('load', () => {
      errorMsg.value = ''
      syncMarkers()
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

watch(() => props.markers, () => {
  syncMarkers()
}, { deep: true })

onBeforeUnmount(() => {
  for (const [id] of mapMarkers.entries()) {
    removeMarkerById(id)
  }
  mapMarkers.clear()
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
