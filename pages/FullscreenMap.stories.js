import AppShell from '../components/AppShell.vue'
import MapLibreMap from '../components/map/MapLibreMap.vue'
import '../fonts/style.css'
import { ref } from 'vue'

export default {
  title: 'Pages/Maps/Fullscreen',
  decorators: [
    () => ({
      components: { AppShell },
      template: `
        <AppShell :fullWidth="true" class="fullscreen-map-shell"><story /></AppShell>
      `
    })
  ],
  parameters: {
    layout: 'fullscreen',
    toolbar: { hidden: true },
    options: { showPanel: false }
  }
}

const BASE = 'https://perspective.angelsolutions.co.uk/Perspective'

const Template = (args) => ({
  components: { MapLibreMap },
  setup() {
    const drawerOpen = ref(false)
    const displayMode = ref('ofsted')
    const kpiSet = ref('')
    const kpiData = {
      Finance: [
        { label: 'Finance Overall', lozenges: [
          { text: 'G', bg: '#5cb85c' }, { text: 'A', bg: '#f0ad4e' }, { text: 'R', bg: '#d9534f' }, { text: 'N/A', bg: '#999' }, { text: 'N/S', bg: '#bbb' }
        ]},
        { label: 'Budget Submitted', lozenges: [
          { text: 'Y', bg: '#5cb85c' }, { text: 'N', bg: '#d9534f' }, { text: 'N/A', bg: '#999' }, { text: 'N/S', bg: '#bbb' }
        ]},
        { label: 'Reserve Levels', lozenges: [
          { text: 'M', bg: '#5cb85c' }, { text: 'S', bg: '#8bc34a' }, { text: 'N', bg: '#f0ad4e' }, { text: 'P', bg: '#d9534f' }, { text: 'N/A', bg: '#999' }, { text: 'N/S', bg: '#bbb' }
        ]},
        { label: 'SLA', lozenges: [
          { text: 'Y', bg: '#5cb85c' }, { text: 'N', bg: '#d9534f' }, { text: 'N/A', bg: '#999' }, { text: 'N/S', bg: '#bbb' }
        ]}
      ],
      'Health & Safety': [
        { label: 'H&S Overall', lozenges: [
          { text: 'G', bg: '#5cb85c' }, { text: 'A', bg: '#f0ad4e' }, { text: 'R', bg: '#d9534f' }, { text: 'N/A', bg: '#999' }, { text: 'N/S', bg: '#bbb' }
        ]},
        { label: 'Fire Risk Assessment', lozenges: [
          { text: 'Y', bg: '#5cb85c' }, { text: 'N', bg: '#d9534f' }, { text: 'N/A', bg: '#999' }, { text: 'N/S', bg: '#bbb' }
        ]},
        { label: 'Asbestos Survey', lozenges: [
          { text: 'Y', bg: '#5cb85c' }, { text: 'N', bg: '#d9534f' }, { text: 'N/A', bg: '#999' }, { text: 'N/S', bg: '#bbb' }
        ]}
      ]
    }
    return { args, drawerOpen, displayMode, kpiSet, kpiData, BASE }
  },
  template: `
    <MapLibreMap v-bind="args">
      <div class="matchmaker-header" style="position:relative;z-index:5;">
        <div class="page-width">
          <div class="row align-items-center">
            <div class="col-6 order-1 col-md-4 col-lg-6">
              <div class="d-flex align-items-center">
                <div class="cursor--pointer">
                  <div class="d-flex align-items-center">
                    <h1 class="mb-0">My Organisation</h1>
                    <i class="entypo--down-open"></i>
                  </div>
                </div>
              </div>
            </div>
            <div class="col-6 order-2 order-xl-3 align-self-center col-md-8 col-lg-6">
              <div class="d-flex align-items-center">
                <div title="Quickly go to a specific school or the middle of a Local Authority or Postcode." class="schools-search schools-search--condensed schools-search__wrapper w-100 mr-3 d-none d-md-block">
                  <div role="combobox" class="schools-search__input-wrapper">
                    <input id="search-input" type="text" placeholder="Search by Name, URN, DfE, Postcode or LA" autocomplete="off" class="schools-search__input size--13">
                    <button role="presentation" aria-hidden="true" class="entypo--search schools-search__search-icon schools-search__search-icon--transparent cursor--inactive"></button>
                  </div>
                </div>
                <button class="btn btn--secondary d-block w-100 w-md-50 ml-auto">
                  <i class="entypo--filter mr-1"></i>Show Filters
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- Map Key Toggle Button -->
      <button
        class="btn btn--secondary"
        style="position:absolute;bottom:24px;left:12px;z-index:10;border-radius:4px;padding:8px 14px;"
        @click="drawerOpen = !drawerOpen"
      >
        Key & Options
      </button>

      <!-- Left Side Drawer -->
      <div
        class="side-drawer side-drawer--left has-side-btn hide-overlay pt-3 pb-5 matchmaker-drawer matchmaker-drawer--key has-sticky-header"
        :class="{ 'side-drawer--left-open': drawerOpen }"
        style="position:absolute;top:89px;left:0;bottom:0;z-index:22;width:420px;overflow-y:auto;background:#fff;box-shadow:2px 0 8px rgba(0,0,0,0.15);transition:transform 0.3s ease;"
        :style="{ transform: drawerOpen ? 'translateX(0)' : 'translateX(-100%)' }"
      >
        <div class="side-drawer__inner">
          <div class="side-drawer__header">
            <div class="d-flex align-items-center mb-3">
              <h4 class="mb-0 font-open-sans" style="color:#3d5a80;font-weight:700;">Display Marker By:</h4>
              <a class="entypo--cancel-circled ml-auto gamma color-angel--secondary cursor--pointer" @click="drawerOpen = false"></a>
            </div>
            <select class="form-control" style="width:100%;" v-model="displayMode">
              <option value="ofsted">Latest Inspection Ofsted: Leadership</option>
              <option value="siams">Latest Inspection CSI</option>
              <option value="ofsted-sef">Perspective Ofsted SEF</option>
              <option value="csed">Perspective CSED</option>
              <option value="kpi">Specific KPI</option>
            </select>
          </div>

          <!-- KPI Set (shown when Specific KPI selected) -->
          <div v-if="displayMode === 'kpi'" style="transition:opacity 0.3s ease;">
            <div class="matchmaker-drawer__section">
              <h4 class="mb-2 font-open-sans" style="color:#3d5a80;font-weight:700;">KPI Set:</h4>
              <select class="form-control" style="width:100%;" v-model="kpiSet">
                <option value="" disabled>Choose KPI Set</option>
                <option value="Finance">Finance</option>
                <option value="Health &amp; Safety">Health &amp; Safety</option>
              </select>
            </div>
            <div v-if="kpiSet && kpiData[kpiSet]" class="matchmaker-drawer__section" style="padding:0;">
              <div
                v-for="(kpi, idx) in kpiData[kpiSet]"
                :key="idx"
                style="display:flex;align-items:center;justify-content:space-between;padding:12px 16px;border-bottom:1px solid #e8e8e8;cursor:pointer;transition:background 0.15s ease;"
                @mouseenter="$event.currentTarget.style.background='#f0f4f8'"
                @mouseleave="$event.currentTarget.style.background='transparent'"
                @click="() => {}"
              >
                <div>
                  <div style="font-weight:600;font-size:13px;color:#3d5a80;margin-bottom:6px;">{{ kpi.label }}</div>
                  <div style="display:flex;gap:4px;flex-wrap:wrap;">
                    <span
                      v-for="(l, li) in kpi.lozenges"
                      :key="li"
                      :style="{ display:'inline-block', padding:'2px 8px', borderRadius:'10px', fontSize:'11px', fontWeight:'600', color:'#fff', backgroundColor: l.bg }"
                    >{{ l.text }}</span>
                  </div>
                </div>
                <i class="entypo--right-open" style="font-size:18px;color:#999;"></i>
              </div>
            </div>
          </div>

          <!-- Default map key content (hidden when Specific KPI selected) -->
          <div v-else style="transition:opacity 0.3s ease;">
            <div class="matchmaker-drawer__section">
              <img :src="BASE + '/App_Vue/static/images/matchmaker/Marker-Diagram.svg'" class="w-100" alt="Diagram explaining different elements of the map markers.">
            </div>
            <div class="matchmaker-drawer__section">
              <h4 class="mb-4 font-open-sans">Ofsted Grade: Leadership</h4>
              <h5 class="mb-2 font-open-sans">2019 EIF (or prior if applicable):</h5>
              <div class="d-flex flex-wrap">
                <div class="ofsted-cell-grade ofsted-cell-grade--outstanding">Outstanding</div>
                <div class="ofsted-cell-grade ofsted-cell-grade--good">Good</div>
                <div class="ofsted-cell-grade ofsted-cell-grade--req">Req. Improvement</div>
                <div class="ofsted-cell-grade ofsted-cell-grade--inadequate">Inadequate</div>
                <div class="ofsted-cell-grade ofsted-cell-grade--no-grade">No Grade</div>
              </div>
              <h5 class="mb-2 font-open-sans">2025 Inspection framework:</h5>
              <div class="d-flex flex-wrap">
                <div class="ofsted-cell-grade ofsted-cell-grade--rag--exc">Exceptional</div>
                <div class="ofsted-cell-grade ofsted-cell-grade--rag--str">Strong</div>
                <div class="ofsted-cell-grade ofsted-cell-grade--rag--sec">Expected</div>
                <div class="ofsted-cell-grade ofsted-cell-grade--rag--an">Needs Attention</div>
                <div class="ofsted-cell-grade ofsted-cell-grade--rag--cc">Urgent Improvement</div>
              </div>
            </div>
            <div class="matchmaker-drawer__section">
              <h4 class="mb-2 font-open-sans">Phase</h4>
              <div class="d-flex flex-wrap matchmaker-drawer__section-phase">
                <div><strong>N</strong> Nursery </div>
                <div><strong>P</strong> Primary </div>
                <div><strong>S</strong> Secondary </div>
                <div><strong>A</strong> All Through </div>
                <div><strong>16</strong> 16 Plus </div>
                <div><strong>O</strong> Other </div>
                <div class="matchmaker-drawer__section-phase-sp">
                  <img :src="BASE + '/App_Vue/static/images/matchmaker/special-school-marker.svg'" alt="Special School Marker"> Special School
                </div>
              </div>
            </div>
            <div class="matchmaker-drawer__section">
              <h4 class="mb-4 font-open-sans">Number on Roll</h4>
              <div class="d-flex align-items-end justify-content-around">
                <img :src="BASE + '/App_Vue/static/images/matchmaker/key-marker-small.svg'" alt="Small Marker">
                <img :src="BASE + '/App_Vue/static/images/matchmaker/key-marker-med.svg'" alt="Medium Marker">
                <img :src="BASE + '/App_Vue/static/images/matchmaker/key-marker-large.svg'" alt="Large Marker">
              </div>
            </div>
            <div class="matchmaker-drawer__section">
              <h4 class="mb-4 font-open-sans">In Year Balance</h4>
              <div class="d-flex align-items-end justify-content-around">
                <img :src="BASE + '/App_Vue/static/images/matchmaker/key-marker-positive.svg'" alt="Positive Marker">
                <img :src="BASE + '/App_Vue/static/images/matchmaker/key-marker-neutral.svg'" alt="Neutral Marker">
                <img :src="BASE + '/App_Vue/static/images/matchmaker/key-marker-negative.svg'" alt="Negative Marker">
                <img :src="BASE + '/App_Vue/static/images/matchmaker/key-marker-na.svg'" alt="Unavailable Marker">
              </div>
            </div>
          </div>
        </div>
      </div>
    </MapLibreMap>
  `
})

export const Default = Template.bind({})
Default.args = {
  mapHeight: 'calc(100vh - 76px)',
  markers: [
    { id: 'a', lat: 53.4084, lng: -2.9916, rollSize: 'md', popup: 'Liverpool' },
    { id: 'b', lat: 53.41, lng: -2.98, rollSize: 'sm', phase: 'A' }
  ]
}
