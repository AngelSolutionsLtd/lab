import { ref, computed, onMounted, onBeforeUnmount } from 'vue'
import LSOAMap from '../components/map/LSOAMap.vue'
import RangeSlider from '../components/RangeSlider.vue'
import Drawer from '../components/Drawer.vue'

export default {
  title: 'Pages/LSOA Map Prototype',
  parameters: {
    layout: 'fullscreen'
  }
}

export const Default = {
  render: () => ({
    components: { LSOAMap, RangeSlider, Drawer },
    setup() {
      const isKeyDrawerOpen = ref(false)
      const isDetailDrawerOpen = ref(false)
      const selectedLSOA = ref(null)
      const threshold = ref(65)
      const fillOpacity = computed(() => (threshold.value / 100) * 0.6)

      function onSelect(feature) {
        selectedLSOA.value = feature
        isDetailDrawerOpen.value = true
      }

      function onDeselect() {
        isDetailDrawerOpen.value = false
        selectedLSOA.value = null
      }

      return {
        isKeyDrawerOpen,
        isDetailDrawerOpen,
        selectedLSOA,
        threshold,
        fillOpacity,
        onSelect,
        onDeselect
      }
    },
    template: `
      <div style="position:relative; width:100vw; height:100vh; overflow:hidden; font-family:'Open Sans',sans-serif;">

        <!-- Full-screen map -->
        <LSOAMap
          :center="[-1.5, 52.5]"
          :zoom="6"
          :fillOpacity="fillOpacity"
          fillColor="#4a90d9"
          lineColor="#2c6fad"
          :showPanel="false"
          mapHeight="100vh"
          mapMinHeight="600px"
          @select="onSelect"
          @deselect="onDeselect"
        />

        <!-- KEY button — bottom left -->
        <button
          @click="isKeyDrawerOpen = !isKeyDrawerOpen"
          style="
            position: fixed;
            bottom: 28px;
            left: 24px;
            z-index: 2000;
            padding: 10px 24px;
            background: #1c2b3a;
            color: #fff;
            font-size: 13px;
            font-weight: 700;
            letter-spacing: 0.12em;
            text-transform: uppercase;
            border: none;
            border-radius: 6px;
            cursor: pointer;
            box-shadow: 0 2px 12px rgba(0,0,0,0.35);
          "
        >KEY</button>

        <!-- Left drawer — legend + threshold slider -->
        <Drawer
          :isOpen="isKeyDrawerOpen"
          direction="left"
          :scrollLocked="false"
          wrapperPadding=""
          :alignTop="true"
          :noOverlay="true"
        >
          <template #header>
            <div style="padding:16px 20px 0; display:flex; justify-content:flex-end;">
              <button
                @click="isKeyDrawerOpen = false"
                style="background:none; border:none; cursor:pointer; font-size:18px; color:#aaa; padding:0; line-height:1;"
              >&#x2715;</button>
            </div>
          </template>

          <div style="padding:20px 20px 28px;">

            <!-- UNDERSTANDING MARKERS -->
            <div style="font-size:15px; font-weight:700; text-transform:uppercase; color:#111; margin-bottom:18px; letter-spacing:0.02em;">
              Understanding Markers
            </div>

            <!-- Authorised Absence -->
            <div style="font-size:15px; font-weight:700; color:#111; margin-bottom:16px;">Authorised Absence</div>

            <div style="display:flex; justify-content:space-around; align-items:flex-start; margin-bottom:6px;">

              <!-- 10.1%+ — pin #B36351 -->
              <div style="display:flex; flex-direction:column; align-items:center; gap:6px; flex:1;">
                <svg xmlns="http://www.w3.org/2000/svg" width="23" height="35" viewBox="0 0 23 35" fill="none" overflow="visible">
                  <path d="M11.5 0C17.8513 0 23 5.14873 23 11.5C23 12.7331 22.8051 13.9206 22.4458 15.0342L22.5 15L22.395 15.1899C21.9581 16.4804 21.2977 17.6674 20.4609 18.7065L11.5 35L2.53857 18.7065C1.70188 17.6674 1.04136 16.4803 0.604492 15.1899L0.5 15L0.553711 15.0342C0.194462 13.9207 0 12.7331 0 11.5C0 5.14873 5.14873 0 11.5 0Z" stroke="black" stroke-width="1" fill="#B36351"/>
                  <circle cx="11.25" cy="11.25" r="8.75" fill="white" stroke="black" stroke-width="1"/>
                </svg>
                <span style="font-size:13px; font-weight:700; color:#111;">10.1%</span>
              </div>

              <!-- 5.1–10% — pin #FED74E -->
              <div style="display:flex; flex-direction:column; align-items:center; gap:6px; flex:1;">
                <svg xmlns="http://www.w3.org/2000/svg" width="23" height="35" viewBox="0 0 23 35" fill="none" overflow="visible">
                  <path d="M11.5 0C17.8513 0 23 5.14873 23 11.5C23 12.7331 22.8051 13.9206 22.4458 15.0342L22.5 15L22.395 15.1899C21.9581 16.4804 21.2977 17.6674 20.4609 18.7065L11.5 35L2.53857 18.7065C1.70188 17.6674 1.04136 16.4803 0.604492 15.1899L0.5 15L0.553711 15.0342C0.194462 13.9207 0 12.7331 0 11.5C0 5.14873 5.14873 0 11.5 0Z" stroke="black" stroke-width="1" fill="#FED74E"/>
                  <circle cx="11.25" cy="11.25" r="8.75" fill="white" stroke="black" stroke-width="1"/>
                </svg>
                <span style="font-size:13px; font-weight:700; color:#111;">5.1 - 10%</span>
              </div>

              <!-- 0–5% — pin #559A47 -->
              <div style="display:flex; flex-direction:column; align-items:center; gap:6px; flex:1;">
                <svg xmlns="http://www.w3.org/2000/svg" width="23" height="35" viewBox="0 0 23 35" fill="none" overflow="visible">
                  <path d="M11.5 0C17.8513 0 23 5.14873 23 11.5C23 12.7331 22.8051 13.9206 22.4458 15.0342L22.5 15L22.395 15.1899C21.9581 16.4804 21.2977 17.6674 20.4609 18.7065L11.5 35L2.53857 18.7065C1.70188 17.6674 1.04136 16.4803 0.604492 15.1899L0.5 15L0.553711 15.0342C0.194462 13.9207 0 12.7331 0 11.5C0 5.14873 5.14873 0 11.5 0Z" stroke="black" stroke-width="1" fill="#559A47"/>
                  <circle cx="11.25" cy="11.25" r="8.75" fill="white" stroke="black" stroke-width="1"/>
                </svg>
                <span style="font-size:13px; font-weight:700; color:#111;">0 - 5%</span>
              </div>

            </div>

            <hr style="border:none; border-top:1px solid #ddd; margin:20px 0;" />

            <!-- Overall Attendance -->
            <div style="font-size:15px; font-weight:700; color:#111; margin-bottom:18px;">Overall Attendance</div>

            <div style="display:grid; grid-template-columns:1fr 1fr; row-gap:20px; column-gap:8px; margin-bottom:24px;">

              <!-- SPA — dark brown -->
              <div style="display:flex; flex-direction:column; align-items:center; gap:6px;">
                <span style="display:inline-block; width:34px; height:34px; border-radius:50%; border:1px solid black; background:#7C4336;"></span>
                <span style="font-size:11px; color:#666; text-align:center; line-height:1.4;">50.1 - 85%</span>
                <span style="font-size:13px; font-weight:700; color:#111; text-align:center;">SPA</span>
              </div>

              <!-- PA — medium red -->
              <div style="display:flex; flex-direction:column; align-items:center; gap:6px;">
                <span style="display:inline-block; width:34px; height:34px; border-radius:50%; border:1px solid black; background:#B36351;"></span>
                <span style="font-size:11px; color:#666; text-align:center; line-height:1.4;">85.1 - 90%</span>
                <span style="font-size:13px; font-weight:700; color:#111; text-align:center;">PA</span>
              </div>

              <!-- At Risk of PA — amber -->
              <div style="display:flex; flex-direction:column; align-items:center; gap:6px;">
                <span style="display:inline-block; width:34px; height:34px; border-radius:50%; border:1px solid black; background:#FED74E;"></span>
                <span style="font-size:11px; color:#666; text-align:center; line-height:1.4;">90.1 - 95%</span>
                <span style="font-size:13px; font-weight:700; color:#111; text-align:center;">At Risk of PA</span>
              </div>

              <!-- On Target — green -->
              <div style="display:flex; flex-direction:column; align-items:center; gap:6px;">
                <span style="display:inline-block; width:34px; height:34px; border-radius:50%; border:1px solid black; background:#559A47;"></span>
                <span style="font-size:11px; color:#666; text-align:center; line-height:1.4;">95.1%+</span>
                <span style="font-size:13px; font-weight:700; color:#111; text-align:center;">On Target</span>
              </div>

            </div>

            <hr style="border:none; border-top:1px solid #ddd; margin:0 0 22px 0;" />

            <!-- Threshold slider -->
            <RangeSlider
              v-model="threshold"
              label="Set Overall Attendance Threshold"
              :min="0"
              :max="100"
              unit="%"
              :showGradient="true"
            />

          </div>
        </Drawer>

        <!-- Right drawer — selected LSOA detail -->
        <Drawer
          :isOpen="isDetailDrawerOpen"
          direction="right"
          :scrollLocked="false"
          wrapperPadding=""
          :alignTop="true"
          :noOverlay="true"
        >
          <template #header>
            <div style="padding:20px 20px 0; display:flex; justify-content:space-between; align-items:flex-start;">
              <div>
                <h2 style="font-size:18px; font-weight:700; color:#7b2d8b; margin:0 0 4px 0;">Area Detail</h2>
                <p style="font-size:12px; color:#888; margin:0;">Selected LSOA information</p>
              </div>
              <button
                @click="isDetailDrawerOpen = false"
                style="background:none; border:none; cursor:pointer; font-size:18px; color:#aaa; padding:0; line-height:1;"
              >&#x2715;</button>
            </div>
          </template>

          <div style="padding:20px;">
            <template v-if="selectedLSOA">
              <div style="background:#f8f4fa; border:1px solid #e4d4ea; border-radius:8px; padding:16px;">
                <div style="font-size:11px; font-weight:700; text-transform:uppercase; letter-spacing:0.08em; color:#7b2d8b; margin-bottom:6px;">
                  {{ selectedLSOA.LSOA21CD }}
                </div>
                <div style="font-size:16px; font-weight:700; color:#1c2b3a; margin-bottom:10px; line-height:1.3;">
                  {{ selectedLSOA.LSOA21NM }}
                </div>
                <div v-if="selectedLSOA.LAT" style="font-size:12px; color:#888;">
                  {{ Number(selectedLSOA.LAT).toFixed(5) }}, {{ Number(selectedLSOA.LONG).toFixed(5) }}
                </div>
              </div>
            </template>
          </div>
        </Drawer>

      </div>
    `
  })
}
