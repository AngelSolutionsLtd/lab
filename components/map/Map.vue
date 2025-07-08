<template>
  <div>
    <div id="leaflet-map" :style="{ height: mapHeight, width: mapWidth }"></div>
    <Drawer :direction="'right'" :isOpen="isOpen" class="layout-drawer">
      <template #header>
        <div class="judgement-drawer__header">
          <h1>{{ selectedIcon?.popup || 'No selection' }}</h1>
          <span class="entypo--cancel-circled ml-auto" @click="closeDrawer"></span>
        </div>
        <div>
          <span>School guid: {{ selectedIcon?.id || 'No selection' }}</span>
        </div>
      </template>
    </Drawer>
  </div>
</template>

<script>
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import { createApp, h } from 'vue';
import SvgMapMarker from './Marker.vue';
import Drawer from '../Drawer.vue';

const markerSizes = {
  sm: { iconSize: [40, 46], iconAnchor: [20, 46] },
  md: { iconSize: [47, 53], iconAnchor: [23.5, 53] },
  lg: { iconSize: [50, 60], iconAnchor: [25, 60] }
};

const iconCache = new Map();

export default {
  name: 'LeafletMap',
  components: { Drawer },
  props: {
    lat: { type: Number, default: 53.4084 },
    lng: { type: Number, default: -2.9916 },
    zoom: { type: Number, default: 13 },
    mapHeight: { type: String, default: '100dvh' },
    mapWidth: { type: String, default: '100%' },
    markers: {
      type: Array,
      default: () => []
    }
  },
  data() {
    return {
      selectedIcon: null,
      isOpen: false,
      map: null
    };
  },
  mounted() {
    // Initialise map
    this.map = L.map('leaflet-map').setView([this.lat, this.lng], this.zoom);

    L.tileLayer('https://api.maptiler.com/maps/streets-v2-pastel/{z}/{x}/{y}.png?key=LYHBN2C1OXZBMOgr5FVq', {
      tileSize: 512,
      zoomOffset: -1,
      attribution:
        '&copy; <a href="https://www.maptiler.com/copyright/" target="_blank">MapTiler</a> & <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
    }).addTo(this.map);

    // Add markers
    this.markers.forEach(marker => {
      const icon = this.createMarkerIcon(marker);
      const leafletMarker = L.marker([marker.lat, marker.lng], { icon }).addTo(this.map);

      leafletMarker.on('click', () => {
        const popup = L.popup({
          offset: [0, -markerSizes[marker.rollSize || 'sm'].iconSize[1]],
          closeButton: true,
          autoPan: true,
          autoClose: true,
          closeOnClick: true,
          className: 'custom-popup'
        })
          .setLatLng([marker.lat, marker.lng])
          .setContent(this.createPopupContent(marker))
          .openOn(this.map);

        this.$nextTick(() => {
          const button = document.querySelector('.popup-action');
          if (button) {
            button.addEventListener('click', () => {
              if (this.selectedIcon?.guid === marker.guid && this.isOpen) {
                this.closeDrawer();
              } else {
                this.selectedIcon = marker;
                this.isOpen = true;
              }
              this.$nextTick(() => {
                popup.setContent(this.createPopupContent(marker));
              });
            });
          }
        });
      });
    });
  },
  beforeUnmount() {
    // Clean up map
    if (this.map) {
      this.map.remove();
    }
  },
  methods: {
    createPopupContent(marker) {
      return `
        <div>
          <strong>${marker.popup || 'Marker'}</strong><br />
          <button class="popup-action" data-guid="${marker.guid}">Open Panel</button>
        </div>
      `;
    },
    createMarkerIcon(markerProps) {
      const { rollSize = 'sm', balance = 'neutral', phase = 'A', hexColor = '#698BAB' } = markerProps;
      const cacheKey = `${rollSize}-${balance}-${phase}-${hexColor}`;

      if (iconCache.has(cacheKey)) {
        return iconCache.get(cacheKey);
      }

      const size = markerSizes[rollSize] || markerSizes.sm;
      const container = document.createElement('div');

      const app = createApp({
        render() {
          return h(SvgMapMarker, { rollSize, balance, phase, hexColor });
        }
      });

      app.mount(container);

      const html = container.innerHTML;

      app.unmount(); // ✅ Clean up Vue app after extracting static HTML

      const icon = L.divIcon({
        html,
        className: '',
        iconSize: size.iconSize,
        iconAnchor: size.iconAnchor,
        popupAnchor: [0, -size.iconSize[1]]
      });

      iconCache.set(cacheKey, icon);
      return icon;
    },
    closeDrawer() {
      this.isOpen = false;
      this.selectedIcon = null;
    }
  }
};
</script>

<style scoped>
.leaflet-container {
  height: 100dvh;
  width: 100%;
}
</style>
