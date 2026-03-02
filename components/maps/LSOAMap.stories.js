import LSOAMap from './LSOAMap.vue'

export default {
  title: 'Map/LSOA Map',
  component: LSOAMap,
  parameters: {
    layout: 'fullscreen',
    docs: {
      description: {
        component: 'Renders Lower Layer Super Output Area (LSOA) boundaries as a polygon vector layer. Hover to highlight, click to inspect.'
      }
    }
  },
  argTypes: {
    center: { control: 'object', description: 'Initial map centre [lng, lat]' },
    zoom: { control: { type: 'range', min: 4, max: 14, step: 0.5 }, description: 'Initial zoom' },
    fillColor: { control: 'color', description: 'Polygon fill colour' },
    lineColor: { control: 'color', description: 'Polygon outline colour' },
    fillOpacity: { control: { type: 'range', min: 0, max: 1, step: 0.05 }, description: 'Fill opacity' },
    geojsonUrl: { control: 'text', description: 'URL for the LSOA GeoJSON file' }
  }
}

export const Default = {
  args: {
    center: [-1.5, 52.5],
    zoom: 6,
    fillColor: '#7aaac8',
    lineColor: '#4a7fa8',
    fillOpacity: 0.15
  }
}

export const EnglandAndWales = {
  args: {
    center: [-1.5, 52.5],
    zoom: 6,
    fillColor: '#4a90d9',
    lineColor: '#2c6fad',
    fillOpacity: 0.2
  }
}

export const Liverpool = {
  args: {
    center: [-2.98, 53.41],
    zoom: 11,
    fillColor: '#7b2d8b',
    lineColor: '#5a1f67',
    fillOpacity: 0.3
  }
}

export const London = {
  args: {
    center: [-0.12, 51.51],
    zoom: 10,
    fillColor: '#e05c1a',
    lineColor: '#b5450f',
    fillOpacity: 0.3
  }
}

export const HighContrast = {
  args: {
    center: [-1.5, 52.5],
    zoom: 7,
    fillColor: '#00a878',
    lineColor: '#007a58',
    fillOpacity: 0.4
  }
}
