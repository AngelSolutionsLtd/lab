import AppShell from '../components/AppShell.vue'
import MapLibreMap from '../components/map/MapLibreMap.vue'
import MapKey from '../components/map/MapKey.vue'

export default {
  title: 'Pages/Maps',
  decorators: [
    () => ({
      components: { AppShell },
      template: `<AppShell :fullWidth="true"><story /></AppShell>`
    })
  ],
  parameters: {
    layout: 'fullscreen'
  }
}

const Template = (args) => ({
  components: { MapLibreMap, MapKey },
  setup() {
    return { args }
  },
  template: `
    <div style="position:relative;">
      <MapLibreMap :key="mapKey" v-bind="args" />
    </div>
  `
})

export const Default = Template.bind({})
Default.args = {
  lat: 53.4084,
  lng: -2.9916,
  zoom: 12,
  mapHeight: '100%',
  mapWidth: '100%',
  markers: [
    { id: 'a', lat: 53.4084, lng: -2.9916, rollSize: 'md', popup: 'Liverpool' },
    { id: 'b', lat: 53.41, lng: -2.98, rollSize: 'sm', phase: 'A' }
  ]
}
