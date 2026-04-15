<template>
  <div class="matchmaker-actions">
    <button class="btn btn--secondary matchmaker-actions__key" @click.prevent="isOpen = true">Key</button>

    <div v-if="isOpen" class="matchmaker-key-overlay" @click.self="isOpen = false">
      <div class="matchmaker-key-panel">
        <div class="d-flex align-items-center matchmaker-key-header">
          <a href="https://observatory.zendesk.com/hc/en-gb/articles/31145825600029" target="_blank" rel="noopener noreferrer" class="link--q italic size--14">
            <i class="entypo--help-circled mr-1"/>Need more help?
          </a>
          <a class="entypo--cancel-circled ml-auto gamma color-angel--secondary" @click.prevent="isOpen = false"></a>
        </div>

        <div class="matchmaker-drawer__section">
          <h4 class="mb-4 font-open-sans">Understanding Markers</h4>
          <div class="matchmaker-key-placeholder">Marker diagram placeholder</div>
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
            <div><strong>N</strong> Nursery</div>
            <div><strong>P</strong> Primary</div>
            <div><strong>S</strong> Secondary</div>
            <div><strong>A</strong> All Through</div>
            <div><strong>16</strong> 16 Plus</div>
            <div><strong>O</strong> Other</div>
            <div class="matchmaker-drawer__section-phase-sp">
              <span class="matchmaker-key-placeholder-inline">Special marker</span> Special School
            </div>
          </div>
        </div>

        <div class="matchmaker-drawer__section">
          <h4 class="mb-4 font-open-sans">Number on Roll</h4>
          <div class="d-flex align-items-end justify-content-around">
            <div class="matchmaker-key-placeholder">Small</div>
            <div class="matchmaker-key-placeholder">Medium</div>
            <div class="matchmaker-key-placeholder">Large</div>
          </div>
        </div>

        <div class="matchmaker-drawer__section">
          <h4 class="mb-4 font-open-sans">In Year Balance</h4>
          <div class="d-flex align-items-end justify-content-around">
            <div class="matchmaker-key-placeholder">Positive</div>
            <div class="matchmaker-key-placeholder">Neutral</div>
            <div class="matchmaker-key-placeholder">Negative</div>
            <div class="matchmaker-key-placeholder">N/A</div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue'
const isOpen = ref(false)
</script>

<style>
.matchmaker-key-overlay {
  position: fixed;
  inset: 0;
  z-index: 9999;
  background: rgba(0,0,0,0.35);
  display: flex;
  justify-content: flex-start;
}

.matchmaker-key-panel {
  width: 420px;
  max-width: 90vw;
  height: 100vh;
  background: #fff;
  overflow: auto;
  padding: 16px;
}

.matchmaker-key-header {
  position: sticky;
  top: 0;
  background: #fff;
  padding-bottom: 12px;
  margin-bottom: 12px;
  z-index: 1;
}

.matchmaker-key-placeholder {
  border: 1px dashed #bbb;
  border-radius: 4px;
  padding: 10px;
  text-align: center;
  width: 100%;
}

.matchmaker-key-placeholder-inline {
  display: inline-block;
  border: 1px dashed #bbb;
  border-radius: 4px;
  padding: 4px 8px;
  margin-right: 8px;
}
</style>
