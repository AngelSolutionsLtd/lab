<template>
  <div class="map-wrapper">
    <div ref="mapContainer" class="map-container"></div>
    <pre v-if="errorMsg" class="map-error">{{ errorMsg }}</pre>
    <div style="position: absolute; top: 10px; right: 10px; background: white; padding: 10px; border: 1px solid #ccc; font-size: 12px; z-index: 1000;">
      <div>Drawer isOpen: {{ isOpen }}</div>
      <div>Selected ID: {{ selectedIcon?.id || 'none' }}</div>
      <div>Zoom: {{ currentZoom?.toFixed(2) || 'N/A' }}</div>
      <div>Map Loaded: {{ mapLoaded ? 'Yes' : 'No' }}</div>
      <div>Data Features: {{ dataFeatureCount }}</div>
      <div>Active Overlay: {{ activeOverlay || 'none' }}</div>
    </div>
    <Drawer :direction="'right'" :isOpen="isOpen" class="layout-drawer">
      <template #header>
        <div class="judgement-drawer__header">
          <h1>{{ selectedIcon?.title || 'No selection' }}</h1>
          <span class="entypo--cancel-circled ml-auto" @click="closeDrawer"></span>
        </div>
        <div>
          <span>Id: {{ selectedIcon?.id || 'No selection' }}</span><br />
          <span v-if="selectedIcon?.district">District: {{ selectedIcon?.district }}</span><br />
          <span v-if="selectedIcon?.unit">Unit: {{ selectedIcon?.unit }}</span><br />
          <span>Category: {{ selectedIcon?.cat || 'N/A' }}</span><br />
          <span v-if="selectedIcon?.isCluster"><br />Cluster size: {{ selectedIcon?.clusterSize }}</span>
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

const mapContainer = ref(null)
const map = ref(null)
const errorMsg = ref('')
const currentZoom = ref(null)
const mapLoaded = ref(false)
const dataFeatureCount = ref(0)
const activeOverlay = ref(null)

const styleUrl = 'https://tiles.openfreemap.org/styles/positron'
const sourceId = 'cluster-points'

// Overlay source/layer IDs
const OVERLAY_SOURCE = 'boundary-overlay'
const OVERLAY_FILL_LAYER = 'boundary-overlay-fill'
const OVERLAY_LINE_LAYER = 'boundary-overlay-line'

const clusterMarkers = new Map()
const clusterLatest = new Map()
const singlePointMarkers = new Map()

const selectedIcon = ref(null)
const isOpen = ref(false)

// Cache for loaded boundary GeoJSON
const boundaryCache = new Map()

async function loadBoundaryGeoJSON(type, name) {
  // type: 'districts' or 'units'
  // name: 'L1', 'L2', 'L3' for districts, or the district name for units
  const cacheKey = `${type}/${name}`
  
  if (boundaryCache.has(cacheKey)) {
    return boundaryCache.get(cacheKey)
  }
  
  try {
    const url = `./geo/postcodes/${type}/${name}.geojson`
    console.log(`Loading boundary from: ${url}`)
    const response = await fetch(url)
    
    if (!response.ok) {
      throw new Error(`Failed to load ${url}: ${response.status}`)
    }
    
    const geojson = await response.json()
    boundaryCache.set(cacheKey, geojson)
    return geojson
  } catch (err) {
    console.error(`Error loading boundary ${type}/${name}:`, err)
    return null
  }
}

function clearBoundaryOverlay() {
  if (!map.value) return
  
  // Remove layers first (must be done before removing source)
  if (map.value.getLayer(OVERLAY_LINE_LAYER)) {
    map.value.removeLayer(OVERLAY_LINE_LAYER)
  }
  if (map.value.getLayer(OVERLAY_FILL_LAYER)) {
    map.value.removeLayer(OVERLAY_FILL_LAYER)
  }
  
  // Then remove source
  if (map.value.getSource(OVERLAY_SOURCE)) {
    map.value.removeSource(OVERLAY_SOURCE)
  }
  
  activeOverlay.value = null
  currentOverlayType.value = null
}

function showBoundaryOverlay(geojson, options = {}) {
  if (!map.value || !geojson) {
    console.warn('showBoundaryOverlay: missing map or geojson')
    return
  }
  
  const { fitBounds = false, fillColor = '#3388ff', lineColor = '#3388ff' } = options
  
  console.log('showBoundaryOverlay called, fitBounds:', fitBounds)
  
  // Clear any existing overlay
  clearBoundaryOverlay()
  
  // Add the source
  map.value.addSource(OVERLAY_SOURCE, {
    type: 'geojson',
    data: geojson
  })
  
  // Add fill layer (more visible)
  map.value.addLayer({
    id: OVERLAY_FILL_LAYER,
    type: 'fill',
    source: OVERLAY_SOURCE,
    paint: {
      'fill-color': fillColor,
      'fill-opacity': 0.35
    }
  })
  
  // Add line layer (outline - thicker and more visible)
  map.value.addLayer({
    id: OVERLAY_LINE_LAYER,
    type: 'line',
    source: OVERLAY_SOURCE,
    paint: {
      'line-color': lineColor,
      'line-width': 4,
      'line-opacity': 1
    }
  })
  
  console.log('Boundary layers added')
  
  // Fit bounds to the overlay if requested
  if (fitBounds) {
    const bounds = getBoundsFromGeoJSON(geojson)
    console.log('Calculated bounds:', bounds)
    if (bounds) {
      map.value.fitBounds(bounds, {
        padding: 80,
        maxZoom: 18,
        duration: 500
      })
    }
  }
}

function panToLocation(coords, zoom = null) {
  if (!map.value) return
  
  const options = {
    center: coords,
    duration: 500
  }
  
  if (zoom !== null) {
    options.zoom = zoom
  }
  
  map.value.easeTo(options)
}

function getBoundsFromGeoJSON(geojson) {
  const bounds = new maplibregl.LngLatBounds()
  
  function processCoordinates(coords, type) {
    if (type === 'Point') {
      bounds.extend(coords)
    } else if (type === 'Polygon') {
      coords[0].forEach(coord => bounds.extend(coord))
    } else if (type === 'MultiPolygon') {
      coords.forEach(polygon => {
        polygon[0].forEach(coord => bounds.extend(coord))
      })
    } else if (type === 'LineString') {
      coords.forEach(coord => bounds.extend(coord))
    }
  }
  
  if (geojson.type === 'FeatureCollection') {
    geojson.features.forEach(feature => {
      processCoordinates(feature.geometry.coordinates, feature.geometry.type)
    })
  } else if (geojson.type === 'Feature') {
    processCoordinates(geojson.geometry.coordinates, geojson.geometry.type)
  }
  
  return bounds.isEmpty() ? null : bounds
}

async function showDistrictBoundary(district, clusterCoords = null) {
  console.log(`Showing district boundary for: ${district}`)
  
  // First try to load the district boundary file
  let geojson = await loadBoundaryGeoJSON('districts', district)
  
  if (geojson) {
    console.log('Loaded district GeoJSON:', geojson.type)
    
    // Handle both FeatureCollection and single Feature
    let displayGeojson = geojson
    
    if (geojson.type === 'FeatureCollection' && geojson.features) {
      console.log(`District file has ${geojson.features.length} features`)
      
      // If multiple features, try to find the matching district
      if (geojson.features.length > 1) {
        const matchingFeature = geojson.features.find(f => {
          const props = f.properties || {}
          const districtValue = props.district || props.DISTRICT || props.name || props.mapit_code
          return districtValue && districtValue.toUpperCase() === district.toUpperCase()
        })
        
        if (matchingFeature) {
          displayGeojson = {
            type: 'FeatureCollection',
            features: [matchingFeature]
          }
        }
      }
      
      // Log first feature properties for debugging
      if (geojson.features[0]) {
        console.log('District feature properties:', geojson.features[0].properties)
      }
    }
    
    showBoundaryOverlay(displayGeojson, {
      fillColor: '#ff6600',
      lineColor: '#ff6600',
      fitBounds: false // Don't auto-fit for districts, let user control view
    })
    currentOverlayType.value = 'district'
    activeOverlay.value = `district:${district}`
    return
  }
  
  // Fallback: try to show all units in the district as a combined boundary
  console.log(`District file not found, trying to load units for ${district}`)
  const unitsGeojson = await loadBoundaryGeoJSON('units', district)
  
  if (unitsGeojson && unitsGeojson.features && unitsGeojson.features.length > 0) {
    console.log(`Showing ${unitsGeojson.features.length} unit boundaries as district overlay`)
    
    showBoundaryOverlay(unitsGeojson, {
      fillColor: '#ff6600',
      lineColor: '#ff6600',
      fitBounds: false
    })
    currentOverlayType.value = 'district'
    activeOverlay.value = `district:${district} (from units)`
    return
  }
  
  console.warn(`Could not load district or units boundary for ${district}`)
  
  // Last fallback: create an approximate boundary around the cluster/district center
  if (clusterCoords) {
    console.log('Creating fallback district boundary circle')
    const circleGeojson = createCircleGeoJSON(clusterCoords, 500)
    showBoundaryOverlay(circleGeojson, {
      fillColor: '#ff6600',
      lineColor: '#ff6600'
    })
    currentOverlayType.value = 'district'
    activeOverlay.value = `district:${district} (approx)`
  }
}

async function showUnitBoundary(district, unit, coords) {
  console.log(`Showing unit boundary for: "${unit}" in district ${district}`)
  
  // Load the district's units file and find the specific unit
  const geojson = await loadBoundaryGeoJSON('units', district)
  
  if (geojson) {
    console.log(`Loaded GeoJSON with ${geojson.features?.length || 0} features`)
    
    // Find the specific unit feature within the district's units
    let unitFeature = null
    
    if (geojson.type === 'FeatureCollection') {
      unitFeature = geojson.features.find(f => {
        const props = f.properties || {}
        // Match by various postcode property names
        const postcodeValue = props.postcodes || props.postcode || props.POSTCODE || props.pcds || props.name || props.unit
        
        if (!postcodeValue) return false
        
        // Normalize both values for comparison (trim whitespace, handle case)
        const normalizedUnit = unit.trim().toUpperCase()
        const normalizedPostcode = postcodeValue.trim().toUpperCase()
        
        return normalizedPostcode === normalizedUnit
      })
    }
    
    if (unitFeature) {
      console.log('Found matching unit boundary!', unitFeature.properties)
      
      // Show just this specific unit boundary and fit to it
      showBoundaryOverlay({
        type: 'FeatureCollection',
        features: [unitFeature]
      }, {
        fillColor: '#3388ff',
        lineColor: '#3388ff',
        fitBounds: true  // Fit map to the unit boundary
      })
      currentOverlayType.value = 'unit'
      activeOverlay.value = `unit:${unit}`
      return
    } else {
      // Could not find the specific unit - log available properties for debugging
      console.warn(`Could not find specific unit "${unit}" in district ${district}`)
      if (geojson.features && geojson.features.length > 0) {
        console.log('Sample postcodes in file:', geojson.features.slice(0, 3).map(f => f.properties?.postcodes))
      }
    }
  } else {
    console.warn(`Could not load unit boundary file for ${district}`)
  }
  
  // Fallback: create a small circle around the point if no boundary found
  if (coords) {
    console.log('Creating fallback boundary circle at', coords)
    const circleGeojson = createCircleGeoJSON(coords, 50) // 50 meter radius
    showBoundaryOverlay(circleGeojson, {
      fillColor: '#3388ff',
      lineColor: '#3388ff'
    })
    currentOverlayType.value = 'unit'
    activeOverlay.value = `unit:${unit} (approx)`
  }
}

// Helper to create a circle GeoJSON polygon
function createCircleGeoJSON(center, radiusMeters, points = 32) {
  const coords = []
  const earthRadius = 6371000 // meters
  
  for (let i = 0; i <= points; i++) {
    const angle = (i / points) * 2 * Math.PI
    const dx = radiusMeters * Math.cos(angle)
    const dy = radiusMeters * Math.sin(angle)
    
    const lat = center[1] + (dy / earthRadius) * (180 / Math.PI)
    const lng = center[0] + (dx / earthRadius) * (180 / Math.PI) / Math.cos(center[1] * Math.PI / 180)
    
    coords.push([lng, lat])
  }
  
  return {
    type: 'FeatureCollection',
    features: [{
      type: 'Feature',
      properties: {},
      geometry: {
        type: 'Polygon',
        coordinates: [coords]
      }
    }]
  }
}

function openDrawer(payload) {
  console.log('openDrawer called with payload:', payload)
  selectedIcon.value = payload
  isOpen.value = true
}

function closeDrawer() {
  isOpen.value = false
  selectedIcon.value = null
  clearBoundaryOverlay()
}

function clearSinglePointMarkers() {
  for (const m of singlePointMarkers.values()) m.remove()
  singlePointMarkers.clear()
  for (const m of stackedMarkers.values()) m.remove()
  stackedMarkers.clear()
}

function colourForCat(cat) {
  return cat === 'A' ? '#21529A' : cat === 'B' ? '#43972A' : cat === 'C' ? '#D4732D' : '#B02418'
}

// Hardcoded L1 postcodes for testing
const L1_POSTCODES = [
  "L1 0AA", "L1 0AB", "L1 0AE", "L1 0AF", "L1 0AG", "L1 0AH", "L1 0AJ", "L1 0AN", "L1 0AQ", "L1 0AR",
  "L1 0AS", "L1 0AT", "L1 0AU", "L1 0AX", "L1 0AY", "L1 0AZ", "L1 0BE", "L1 0BG", "L1 0BL", "L1 0BN",
  "L1 0BP", "L1 0BS", "L1 0BT", "L1 0BW", "L1 0BY", "L1 0DA", "L1 0DB", "L1 0DF", "L1 0DH", "L1 0DN",
  "L1 1DA", "L1 1DE", "L1 1DF", "L1 1DG", "L1 1DJ", "L1 1DN", "L1 1DP", "L1 1DQ", "L1 1DS", "L1 1EB",
  "L1 1ED", "L1 1EE", "L1 1EF", "L1 1EJ", "L1 1EL", "L1 1EP", "L1 1EQ", "L1 1FS", "L1 1HF", "L1 1HL",
  "L1 1HQ", "L1 1HU", "L1 1HW", "L1 1JA", "L1 1JD", "L1 1JE", "L1 1JF", "L1 1JJ", "L1 1JN", "L1 1JP",
  "L1 1JQ", "L1 1JR", "L1 1JT", "L1 1JW", "L1 1LD", "L1 1LE", "L1 1LG", "L1 1LH", "L1 1LJ", "L1 1LN",
  "L1 1LP", "L1 1LQ", "L1 1LR", "L1 1LS", "L1 1LT", "L1 1LU", "L1 1LW", "L1 1LX", "L1 1LY", "L1 1LZ",
  "L1 1NA", "L1 1NB", "L1 1ND", "L1 1NE", "L1 1NG", "L1 1NH", "L1 1NN", "L1 1NP", "L1 1NQ", "L1 1NT",
  "L1 1NW", "L1 1NY", "L1 1PW", "L1 1QE", "L1 1QR", "L1 1QY", "L1 1RD", "L1 1RG", "L1 1RH", "L1 1RJ",
  "L1 1RL", "L1 1RQ", "L1 2SA", "L1 2SD", "L1 2SE", "L1 2SF", "L1 2SG", "L1 2SJ", "L1 2SP", "L1 2SR",
  "L1 2SS", "L1 2ST", "L1 2SU", "L1 2SX", "L1 2TE", "L1 2TQ", "L1 2TR", "L1 2TZ", "L1 2UA", "L1 3AG",
  "L1 3AP", "L1 3AW", "L1 3AY", "L1 5HY", "L1 5HZ", "L1 5JD", "L1 5JE", "L1 5JH", "L1 5JJ", "L1 5JL",
  "L1 5JN", "L1 5JP", "L1 5JR", "L1 5JW", "L1 6AA", "L1 6AE", "L1 6AF", "L1 6AL", "L1 6AU", "L1 6BA",
  "L1 6BB", "L1 6BD", "L1 6BG", "L1 6BL", "L1 6BQ", "L1 6BR", "L1 6BU", "L1 6BW", "L1 6BX", "L1 6DA",
  "L1 6DE", "L1 6DG", "L1 6DP", "L1 6DQ", "L1 6DS", "L1 6DT", "L1 6DX", "L1 6DZ", "L1 6EG", "L1 6ER",
  "L1 6HB", "L1 6JB", "L1 6JD", "L1 6LD", "L1 6RA", "L1 7AG", "L1 7AY", "L1 7AZ", "L1 7BA", "L1 7BG",
  "L1 7BJ", "L1 7BL", "L1 7BP", "L1 7BR", "L1 7BS", "L1 7BT", "L1 7BW", "L1 7BX", "L1 7BY", "L1 7BZ",
  "L1 8AA", "L1 8AD", "L1 8AE", "L1 8AF", "L1 8AG", "L1 8AH", "L1 8AJ", "L1 8AL", "L1 8AN", "L1 8AP",
  "L1 8BJ", "L1 8BN", "L1 8BQ", "L1 8BU", "L1 8DA", "L1 8DB", "L1 8DE", "L1 8DG", "L1 8DL", "L1 8DN",
  "L1 8DP", "L1 8DQ", "L1 8DS", "L1 8DT", "L1 8DW", "L1 8DX", "L1 8DZ", "L1 8EE", "L1 8EF", "L1 8HG",
  "L1 8JF", "L1 8JQ", "L1 8JS", "L1 8JU", "L1 8JX", "L1 8LB", "L1 8LJ", "L1 8LN", "L1 8LP", "L1 8LT",
  "L1 8LU", "L1 8LW", "L1 8LY", "L1 8LZ", "L1 8ND", "L1 9AA", "L1 9AD", "L1 9AF", "L1 9AH", "L1 9AJ",
  "L1 9AL", "L1 9AR", "L1 9AS", "L1 9AT", "L1 9AW", "L1 9AX", "L1 9BB", "L1 9BE", "L1 9BG", "L1 9BH",
  "L1 9BP", "L1 9BQ", "L1 9BR", "L1 9BT", "L1 9BU", "L1 9BW", "L1 9BX", "L1 9BY", "L1 9BZ", "L1 9DA",
  "L1 9DB", "L1 9DE", "L1 9DF", "L1 9DH", "L1 9DN", "L1 9DP", "L1 9DS", "L1 9DT", "L1 9DU", "L1 9DW",
  "L1 9DY", "L1 9DZ", "L1 9ED", "L1 9EF", "L1 9EH", "L1 9EN", "L1 9ER", "L1 9EW", "L1 9EX", "L1 9HB",
  "L1 9HD", "L1 9HE", "L1 9HF", "L1 9JD", "L1 9JF", "L1 9JG"
]

// Helper to get centroid from polygon coordinates
function getCentroidFromCoords(geometry) {
  let allCoords = []
  
  if (geometry.type === 'Polygon') {
    allCoords = geometry.coordinates[0]
  } else if (geometry.type === 'MultiPolygon') {
    // Use the first polygon's outer ring
    allCoords = geometry.coordinates[0][0]
  } else {
    return null
  }
  
  if (!allCoords || allCoords.length === 0) return null
  
  let sumLng = 0
  let sumLat = 0
  
  allCoords.forEach(coord => {
    sumLng += coord[0]
    sumLat += coord[1]
  })
  
  return [sumLng / allCoords.length, sumLat / allCoords.length]
}

async function generateUnitsFromGeoJSON() {
  const cats = ['A', 'B', 'C', 'D']
  const features = []
  
  // Postcodes that will have multiple units (simulating multiple flats/offices at same address)
  const DUPLICATE_POSTCODES = {
    'L1 0AA': 8,  // 8 units at this postcode
    'L1 1DA': 6,  // 6 units
    'L1 1JA': 5,  // 5 units
    'L1 2SA': 7,  // 7 units
    'L1 6AA': 5,  // 5 units
    'L1 8AA': 6,  // 6 units
    'L1 9AA': 9,  // 9 units
  }
  
  console.log('Loading L1 GeoJSON to generate unit positions...')
  
  try {
    const response = await fetch('./geo/postcodes/units/L1.geojson')
    if (!response.ok) {
      console.warn('Could not load L1 GeoJSON, falling back to spiral pattern')
      return null
    }
    
    const geojson = await response.json()
    
    if (geojson.type !== 'FeatureCollection' || !geojson.features) {
      console.warn('Invalid GeoJSON format')
      return null
    }
    
    console.log(`Loaded ${geojson.features.length} features from L1.geojson`)
    
    // Create a map of postcode -> feature for quick lookup
    const postcodeMap = new Map()
    geojson.features.forEach(f => {
      const postcode = f.properties?.postcodes || f.properties?.postcode
      if (postcode) {
        postcodeMap.set(postcode.trim().toUpperCase(), f)
      }
    })
    
    console.log(`Mapped ${postcodeMap.size} postcodes`)
    
    let unitIndex = 0
    
    // Generate features for each of our hardcoded postcodes
    L1_POSTCODES.forEach((postcode) => {
      const feature = postcodeMap.get(postcode.toUpperCase())
      
      if (feature && feature.geometry) {
        const centroid = getCentroidFromCoords(feature.geometry)
        
        if (centroid) {
          // Check if this postcode should have duplicates
          const duplicateCount = DUPLICATE_POSTCODES[postcode] || 1
          
          for (let i = 0; i < duplicateCount; i++) {
            const cat = cats[Math.floor(Math.random() * cats.length)]
            const isDuplicate = duplicateCount > 1
            
            // Add tiny offset for duplicates so they're not exactly stacked
            // (but small enough they'll still cluster)
            const offset = isDuplicate ? (i * 0.00001) : 0
            
            features.push({
              type: 'Feature',
              properties: {
                id: `unit-${unitIndex}`,
                cat,
                district: 'L1',
                unit: postcode,
                title: isDuplicate ? `Unit ${i + 1} at ${postcode}` : `Unit ${postcode}`,
                isUnit: true,
                isDuplicate: isDuplicate,
                unitNumber: isDuplicate ? i + 1 : null,
                totalUnitsAtPostcode: duplicateCount
              },
              geometry: {
                type: 'Point',
                coordinates: [centroid[0] + offset, centroid[1] + offset]
              }
            })
            
            unitIndex++
          }
        } else {
          console.warn(`Could not get centroid for ${postcode}`)
        }
      } else {
        console.warn(`No matching feature found for ${postcode}`)
      }
    })
    
    console.log(`Generated ${features.length} units from GeoJSON centroids (including ${Object.values(DUPLICATE_POSTCODES).reduce((a, b) => a + b, 0) - Object.keys(DUPLICATE_POSTCODES).length} duplicates)`)
    
    return {
      type: 'FeatureCollection',
      features
    }
  } catch (err) {
    console.error('Error loading GeoJSON:', err)
    return null
  }
}

function generateFallbackUnits() {
  // This is now just a fallback if GeoJSON loading fails
  const cats = ['A', 'B', 'C', 'D']
  const features = []
  const center = [-2.9916, 53.4084]
  
  console.log('Generating fallback spiral units (GeoJSON not available)...')
  
  L1_POSTCODES.forEach((postcode, index) => {
    const angle = (index / L1_POSTCODES.length) * Math.PI * 6
    const distance = 0.002 + (index / L1_POSTCODES.length) * 0.008
    
    const lng = center[0] + Math.cos(angle) * distance / Math.cos((center[1] * Math.PI) / 180)
    const lat = center[1] + Math.sin(angle) * distance
    
    const cat = cats[Math.floor(Math.random() * cats.length)]
    
    features.push({
      type: 'Feature',
      properties: {
        id: `unit-${index}`,
        cat,
        district: 'L1',
        unit: postcode,
        title: `Unit ${postcode}`,
        isUnit: true
      },
      geometry: {
        type: 'Point',
        coordinates: [lng, lat]
      }
    })
  })
  
  return {
    type: 'FeatureCollection',
    features
  }
}

function makeDonutSvg({ a = 0, b = 0, c = 0, d = 0, isSinglePoint = false, singleColor = null }) {
  const total = a + b + c + d || 1
  const slices = [
    { value: a, fill: '#21529A' },
    { value: b, fill: '#43972A' },
    { value: c, fill: '#D4732D' },
    { value: d, fill: '#B02418' }
  ]
  const size = 64
  const cx = size / 2
  const cy = size / 2
  const rOuter = 28
  const rInner = 18
  let content = ''
  
  if (isSinglePoint && singleColor) {
    const ringWidth = rOuter - rInner
    const ringRadius = (rOuter + rInner) / 2
    content = `
      <circle cx="${cx}" cy="${cy}" r="${rOuter}" fill="#fff" opacity="0.95"></circle>
      <circle cx="${cx}" cy="${cy}" r="${ringRadius}" fill="none" stroke="${singleColor}" stroke-width="${ringWidth}"></circle>
      <circle cx="${cx}" cy="${cy}" r="${rOuter}" fill="none" stroke="#111" stroke-width="2" opacity="0.15"></circle>
      <circle cx="${cx}" cy="${cy}" r="${rInner}" fill="#fff" opacity="0.98"></circle>
    `
  } else {
    let acc = 0
    const paths = slices.map(s => {
      if (!s.value) return ''
      const start = (acc / total) * Math.PI * 2
      acc += s.value
      const end = (acc / total) * Math.PI * 2
      const x1 = cx + rOuter * Math.cos(start)
      const y1 = cy + rOuter * Math.sin(start)
      const x2 = cx + rOuter * Math.cos(end)
      const y2 = cy + rOuter * Math.sin(end)
      const x3 = cx + rInner * Math.cos(end)
      const y3 = cy + rInner * Math.sin(end)
      const x4 = cx + rInner * Math.cos(start)
      const y4 = cy + rInner * Math.sin(start)
      const largeArc = end - start > Math.PI ? 1 : 0
      return `<path d="M ${x1} ${y1} A ${rOuter} ${rOuter} 0 ${largeArc} 1 ${x2} ${y2} L ${x3} ${y3} A ${rInner} ${rInner} 0 ${largeArc} 0 ${x4} ${y4} Z" fill="${s.fill}" />`
    }).join('')
    content = `
      <circle cx="${cx}" cy="${cy}" r="${rOuter}" fill="#fff" opacity="0.95"></circle>
      ${paths}
      <circle cx="${cx}" cy="${cy}" r="${rOuter}" fill="none" stroke="#111" stroke-width="2" opacity="0.15"></circle>
      <circle cx="${cx}" cy="${cy}" r="${rInner}" fill="#fff" opacity="0.98"></circle>
    `
  }
  const display = total >= 1000 ? `${Math.round(total / 100) / 10}k` : String(total)
  return `
    <svg width="${size}" height="${size}" viewBox="0 0 ${size} ${size}" aria-hidden="true">
      ${content}
      <text x="${cx}" y="${cy + 5}" text-anchor="middle" font-size="16" font-weight="700" fill="#111">${display}</text>
    </svg>
  `
}

function eventCameFromMarkerOrCluster(e) {
  const ev = e?.originalEvent
  const path = ev?.composedPath ? ev.composedPath() : null
  const target = ev?.target
  const nodes = Array.isArray(path) && path.length ? path : (target ? [target] : [])
  for (const n of nodes) {
    if (!n || !n.classList) continue
    if (n.classList.contains('cluster-pie')) return true
    if (n.classList.contains('single-point-pie')) return true
    if (n.classList.contains('maplibregl-marker')) return true
  }
  return false
}

// Track the current overlay type so we can clear it appropriately
const currentOverlayType = ref(null) // 'district' or 'unit'

// Zoom threshold - above this zoom level, hide district boundaries
const DISTRICT_ZOOM_THRESHOLD = 15

// Helper to determine dominant district in a cluster
// Since all current data is L1, we can simplify this
async function getDominantDistrictFromCluster(clusterId, source) {
  // For now, since all data is L1, just return L1 immediately
  // This avoids the slow getClusterLeaves call
  // When you have multiple districts, you can uncomment the full implementation
  
  return 'L1'
  
  /* Full implementation for multiple districts:
  return new Promise((resolve) => {
    const timeout = setTimeout(() => {
      console.warn('getClusterLeaves timed out, using default district')
      resolve('L1')
    }, 2000)
    
    try {
      source.getClusterLeaves(clusterId, Infinity, 0, (err, leaves) => {
        clearTimeout(timeout)
        
        if (err) {
          console.error('getClusterLeaves error:', err)
          resolve('L1')
          return
        }
        
        if (!leaves || leaves.length === 0) {
          console.warn('No leaves found for cluster')
          resolve('L1')
          return
        }
        
        const districtCounts = {}
        leaves.forEach(leaf => {
          const district = leaf.properties?.district
          if (district) {
            districtCounts[district] = (districtCounts[district] || 0) + 1
          }
        })
        
        let maxCount = 0
        let dominant = 'L1'
        Object.entries(districtCounts).forEach(([district, count]) => {
          if (count > maxCount) {
            maxCount = count
            dominant = district
          }
        })
        
        resolve(dominant)
      })
    } catch (err) {
      clearTimeout(timeout)
      console.error('Exception in getClusterLeaves:', err)
      resolve('L1')
    }
  })
  */
}

function updateHtmlClusters() {
  if (!map.value) return
  const src = map.value.getSource(sourceId)
  if (!src) return
  
  const features = map.value.querySourceFeatures(sourceId)
  const seen = new Set()
  
  // Count clusters for debugging
  const clusterFeatures = features.filter(f => f.properties?.cluster)
  if (clusterFeatures.length > 0) {
    console.log(`Found ${clusterFeatures.length} cluster features`)
  }
  
  for (const f of features) {
    const props = f.properties || {}
    if (!props.cluster) continue
    
    const clusterId = Number(props.cluster_id)
    const coords = f.geometry.coordinates
    
    seen.add(clusterId)
    clusterLatest.set(clusterId, { coords, props })
    
    let marker = clusterMarkers.get(clusterId)
    if (!marker) {
      console.log(`Creating cluster marker for cluster ${clusterId} at`, coords)
      
      const el = document.createElement('button')
      el.type = 'button'
      el.className = 'cluster-pie'
      el.style.border = '0'
      el.style.background = 'transparent'
      el.style.cursor = 'pointer'
      el.style.padding = '0'
      el.style.pointerEvents = 'auto'
      el.style.zIndex = '10'
      
      marker = new maplibregl.Marker({ element: el, anchor: 'center' })
        .setLngLat(coords)
        .addTo(map.value)
      
      // Store clusterId on the element for the click handler
      el.dataset.clusterId = clusterId
      
      const onClusterClick = async (ev) => {
        ev.preventDefault()
        ev.stopPropagation()
        
        const currentData = clusterLatest.get(clusterId)
        const currentProps = currentData?.props || props
        const currentCoords = currentData?.coords || coords
        
        const currentZoomLevel = map.value.getZoom()
        const source = map.value.getSource(sourceId)
        
        // If zoomed in past threshold, try to expand the cluster
        if (currentZoomLevel >= DISTRICT_ZOOM_THRESHOLD) {
          
          // Get the expansion zoom for this cluster
          source.getClusterExpansionZoom(clusterId, async (err, expansionZoom) => {
            if (err) {
              console.error('Error getting expansion zoom:', err)
              return
            }
            
            // If we're already at or past the expansion zoom, this cluster can't expand further
            // This means multiple units are at the same location - show the postcode boundary
            if (currentZoomLevel >= expansionZoom || expansionZoom > 17) {
              console.log('Max zoom cluster - showing postcode boundary')
              
              const immediateCategories = {
                A: Number(currentProps.a || 0),
                B: Number(currentProps.b || 0),
                C: Number(currentProps.c || 0),
                D: Number(currentProps.d || 0)
              }
              const immediateTotal = immediateCategories.A + immediateCategories.B + immediateCategories.C + immediateCategories.D
              
              // Get the postcode from one of the leaves
              let postcode = 'Unknown'
              source.getClusterLeaves(clusterId, 1, 0, (err, leaves) => {
                if (!err && leaves && leaves.length > 0) {
                  postcode = leaves[0].properties?.unit || 'Unknown'
                }
                
                openDrawer({
                  id: `cluster-${clusterId}`,
                  title: `${immediateTotal} units at ${postcode}`,
                  district: 'L1',
                  unit: postcode,
                  cat: `A:${immediateCategories.A}, B:${immediateCategories.B}, C:${immediateCategories.C}, D:${immediateCategories.D}`,
                  isCluster: true,
                  clusterSize: immediateTotal,
                  isMaxZoomCluster: true
                })
                
                // Show the unit/postcode boundary instead of district
                showUnitBoundary('L1', postcode, currentCoords)
              })
              
              return
            }
            
            // Can still expand - zoom in
            console.log('Expanding cluster, zoom to:', expansionZoom)
            map.value.easeTo({
              center: currentCoords,
              zoom: Math.min(expansionZoom, 18),
              duration: 500
            })
          })
          
          return
        }
        
        // At district level - show district boundary and drawer
        console.log('=== Cluster clicked (district level) ===', clusterId)
        
        const immediateCategories = {
          A: Number(currentProps.a || 0),
          B: Number(currentProps.b || 0),
          C: Number(currentProps.c || 0),
          D: Number(currentProps.d || 0)
        }
        const immediateTotal = immediateCategories.A + immediateCategories.B + immediateCategories.C + immediateCategories.D
        
        // Get dominant district (fast since we hardcoded L1)
        const dominantDistrict = await getDominantDistrictFromCluster(clusterId, source)
        
        openDrawer({
          id: `cluster-${clusterId}`,
          title: `Cluster of ${immediateTotal} units`,
          district: dominantDistrict,
          cat: `A:${immediateCategories.A}, B:${immediateCategories.B}, C:${immediateCategories.C}, D:${immediateCategories.D}`,
          isCluster: true,
          clusterSize: immediateTotal
        })
        
        // Show the district boundary
        await showDistrictBoundary(dominantDistrict, currentCoords)
      }
      
      el.addEventListener('click', onClusterClick)
      clusterMarkers.set(clusterId, marker)
    }
    
    const el = marker.getElement()
    el.innerHTML = makeDonutSvg({
      a: Number(props.a || 0),
      b: Number(props.b || 0),
      c: Number(props.c || 0),
      d: Number(props.d || 0)
    })
    el.style.pointerEvents = 'auto'
    el.style.zIndex = '10'
    const svg = el.querySelector('svg')
    if (svg) svg.style.pointerEvents = 'none'
    marker.setLngLat(coords)
  }
  
  for (const [id, marker] of clusterMarkers.entries()) {
    if (!seen.has(id)) {
      marker.remove()
      clusterMarkers.delete(id)
      clusterLatest.delete(id)
    }
  }
}

// Track stacked location markers separately
const stackedMarkers = new Map()

// Debounce timer for single point updates
let singlePointUpdateTimer = null

function updateSinglePointPies() {
  // Debounce rapid calls
  if (singlePointUpdateTimer) {
    clearTimeout(singlePointUpdateTimer)
  }
  
  singlePointUpdateTimer = setTimeout(() => {
    updateSinglePointPiesImmediate()
  }, 50)
}

function updateSinglePointPiesImmediate() {
  if (!map.value) return
  const features = map.value.queryRenderedFeatures({ layers: ['unclustered-points'] })
  const seenSingle = new Set()
  const seenStacked = new Set()
  
  // Group features by postcode to find stacked locations
  const postcodeGroups = new Map()
  
  for (const f of features) {
    const id = f?.properties?.id
    const postcode = f?.properties?.unit
    if (!id || !postcode) continue
    
    if (!postcodeGroups.has(postcode)) {
      postcodeGroups.set(postcode, [])
    }
    postcodeGroups.get(postcode).push(f)
  }
  
  // Process each postcode group
  for (const [postcode, group] of postcodeGroups.entries()) {
    const firstFeature = group[0]
    const coords = firstFeature.geometry.coordinates
    
    if (group.length === 1) {
      // Single unit at this postcode - show single point marker
      const f = firstFeature
      const id = f.properties.id
      seenSingle.add(id)
      
      // Remove stacked marker for this postcode if it exists
      if (stackedMarkers.has(postcode)) {
        stackedMarkers.get(postcode).remove()
        stackedMarkers.delete(postcode)
      }
      
      let marker = singlePointMarkers.get(id)
      if (!marker) {
        const cat = f.properties.cat
        const color = colourForCat(cat)
        const el = document.createElement('button')
        el.type = 'button'
        el.className = 'single-point-pie'
        el.style.border = '0'
        el.style.background = 'transparent'
        el.style.cursor = 'pointer'
        el.style.padding = '0'
        el.style.pointerEvents = 'auto'
        
        el.innerHTML = makeDonutSvg({
          a: 0, b: 0, c: 0, d: 0,
          isSinglePoint: true,
          singleColor: color
        })
        
        const svg = el.querySelector('svg')
        if (svg) svg.style.pointerEvents = 'none'
        
        marker = new maplibregl.Marker({ element: el, anchor: 'center' })
          .setLngLat(coords)
          .addTo(map.value)
        
        const featureProps = { ...f.properties }
        const featureCoords = [...coords]
        
        el.addEventListener('click', async (e) => {
          e.preventDefault()
          e.stopPropagation()
          
          openDrawer({
            id: featureProps.id,
            cat: featureProps.cat,
            district: featureProps.district,
            unit: featureProps.unit,
            title: featureProps.title || 'Unit',
            isUnit: true
          })
          
          await showUnitBoundary(featureProps.district, featureProps.unit, featureCoords)
        })
        
        singlePointMarkers.set(id, marker)
      } else {
        marker.setLngLat(coords)
      }
    } else {
      // Multiple units at this postcode - show cluster-style marker
      seenStacked.add(postcode)
      
      // Hide individual markers for this postcode first
      group.forEach(f => {
        const id = f.properties?.id
        if (id) {
          seenSingle.delete(id) // Don't keep these as "seen"
          if (singlePointMarkers.has(id)) {
            singlePointMarkers.get(id).remove()
            singlePointMarkers.delete(id)
          }
        }
      })
      
      // Count categories
      const catCounts = { A: 0, B: 0, C: 0, D: 0 }
      group.forEach(f => {
        const cat = f.properties?.cat
        if (cat && catCounts.hasOwnProperty(cat)) {
          catCounts[cat]++
        }
      })
      
      let marker = stackedMarkers.get(postcode)
      const needsUpdate = !marker
      
      if (!marker) {
        const el = document.createElement('button')
        el.type = 'button'
        el.className = 'cluster-pie stacked-marker'
        el.style.border = '0'
        el.style.background = 'transparent'
        el.style.cursor = 'pointer'
        el.style.padding = '0'
        el.style.pointerEvents = 'auto'
        el.style.zIndex = '15'
        
        marker = new maplibregl.Marker({ element: el, anchor: 'center' })
          .setLngLat(coords)
          .addTo(map.value)
        
        const featureCoords = [...coords]
        const capturedPostcode = postcode
        
        el.addEventListener('click', async (e) => {
          e.preventDefault()
          e.stopPropagation()
          
          // Get fresh data for this postcode
          const currentFeatures = map.value.queryRenderedFeatures({ layers: ['unclustered-points'] })
          const currentGroup = currentFeatures.filter(f => f.properties?.unit === capturedPostcode)
          
          const currentCatCounts = { A: 0, B: 0, C: 0, D: 0 }
          currentGroup.forEach(f => {
            const cat = f.properties?.cat
            if (cat && currentCatCounts.hasOwnProperty(cat)) {
              currentCatCounts[cat]++
            }
          })
          const total = currentGroup.length || group.length
          
          openDrawer({
            id: `stacked-${capturedPostcode}`,
            title: `${total} units at ${capturedPostcode}`,
            district: 'L1',
            unit: capturedPostcode,
            cat: `A:${currentCatCounts.A}, B:${currentCatCounts.B}, C:${currentCatCounts.C}, D:${currentCatCounts.D}`,
            isCluster: true,
            clusterSize: total,
            isStackedLocation: true
          })
          
          await showUnitBoundary('L1', capturedPostcode, featureCoords)
        })
        
        stackedMarkers.set(postcode, marker)
      }
      
      // Update the marker appearance
      const el = marker.getElement()
      el.innerHTML = makeDonutSvg({
        a: catCounts.A,
        b: catCounts.B,
        c: catCounts.C,
        d: catCounts.D
      })
      const svg = el.querySelector('svg')
      if (svg) svg.style.pointerEvents = 'none'
      marker.setLngLat(coords)
    }
  }
  
  // Clean up markers that are no longer visible
  for (const [id, marker] of singlePointMarkers.entries()) {
    if (!seenSingle.has(id)) {
      marker.remove()
      singlePointMarkers.delete(id)
    }
  }
  
  for (const [postcode, marker] of stackedMarkers.entries()) {
    if (!seenStacked.has(postcode)) {
      marker.remove()
      stackedMarkers.delete(postcode)
    }
  }
}

function removeAllClusterMarkers() {
  for (const [, marker] of clusterMarkers.entries()) marker.remove()
  clusterMarkers.clear()
  clusterLatest.clear()
}

onMounted(() => {
  console.log('=== Component mounting ===')
  try {
    map.value = new maplibregl.Map({
      container: mapContainer.value,
      style: styleUrl,
      center: [-2.9850, 53.4065],
      zoom: 12,
      minZoom: 5,
      maxZoom: 18
    })
    
    console.log('Map created')
    
    map.value.dragRotate.disable()
    map.value.addControl(new maplibregl.NavigationControl({ showCompass: false }), 'top-left')
    
    map.value.on('zoom', () => {
      currentZoom.value = map.value.getZoom()
      
      // Hide district boundary when zooming in past threshold
      if (currentZoom.value > DISTRICT_ZOOM_THRESHOLD && currentOverlayType.value === 'district') {
        clearBoundaryOverlay()
      }
    })
    
    map.value.on('load', async () => {
      console.log('=== Map loaded ===')
      errorMsg.value = ''
      currentZoom.value = map.value.getZoom()
      mapLoaded.value = true
      
      // Try to load units from GeoJSON first, fall back to spiral pattern
      let unitsData = await generateUnitsFromGeoJSON()
      if (!unitsData || unitsData.features.length === 0) {
        unitsData = generateFallbackUnits()
      }
      
      dataFeatureCount.value = unitsData.features.length
      
      console.log('Adding source with', unitsData.features.length, 'features')
      
      map.value.addSource(sourceId, {
        type: 'geojson',
        data: unitsData,
        cluster: true,
        clusterRadius: 60,
        clusterMaxZoom: 17,
        clusterProperties: {
          a: ['+', ['case', ['==', ['get', 'cat'], 'A'], 1, 0]],
          b: ['+', ['case', ['==', ['get', 'cat'], 'B'], 1, 0]],
          c: ['+', ['case', ['==', ['get', 'cat'], 'C'], 1, 0]],
          d: ['+', ['case', ['==', ['get', 'cat'], 'D'], 1, 0]]
        }
      })
      
      map.value.addLayer({
        id: 'unclustered-points',
        type: 'circle',
        source: sourceId,
        filter: ['!', ['has', 'point_count']],
        paint: { 'circle-radius': 0, 'circle-opacity': 0 }
      })
      
      // Use 'idle' instead of 'render' to reduce flickering
      map.value.on('idle', updateHtmlClusters)
      map.value.on('moveend', updateHtmlClusters)
      map.value.on('idle', updateSinglePointPies)
      map.value.on('moveend', updateSinglePointPies)
      
      map.value.on('click', (e) => {
        if (eventCameFromMarkerOrCluster(e)) return
        closeDrawer()
      })
      
      updateHtmlClusters()
      updateSinglePointPies()
      
      console.log('=== Map setup complete ===')
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
    console.error('Mount error:', e)
  }
})

onBeforeUnmount(() => {
  clearSinglePointMarkers()
  removeAllClusterMarkers()
  clearBoundaryOverlay()
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
.cluster-pie,
.single-point-pie {
  width: 64px;
  height: 64px;
  pointer-events: auto !important;
}

.cluster-pie {
  z-index: 10 !important;
}

.cluster-pie.stacked-marker {
  z-index: 15 !important;
}

.single-point-pie {
  z-index: 5 !important;
}

.cluster-pie svg,
.single-point-pie svg {
  pointer-events: none;
}
.cluster-pie:hover,
.single-point-pie:hover {
  opacity: 0.9;
}

.side-drawer.side-drawer--right:before {
  content: none !important;
}
</style>