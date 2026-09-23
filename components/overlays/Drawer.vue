<template>
  <transition :name="`${direction}-drawer`">
    <div v-if="isOpen || hasSideBtn" class="side-drawer" :class="[isOpen ? `side-drawer--${direction}-open` : '', `side-drawer--${direction}`, { 'has-side-btn': hasSideBtn, 'body-scroll-enabled': !scrollLocked, 'side-drawer--no-overlay': noOverlay }, wrapperPadding]" :style="alignTop ? 'top: 0 !important; height: 100vh !important;' : ''" ref="drawerParent">
      <div class="side-drawer__inner" :class="{ 'side-drawer__inner-padding': isFixed }" ref="drawerChild">
        <div v-if="hasHeader" class="side-drawer__header" :class="{ 'side-drawer__header-fixed': isFixed }">
          <slot name="header"></slot>
        </div>

        <div ref="drawerBody">
          <slot></slot>

          <slot name="additionalContent"></slot>
        </div>

        <div v-if="hasFooter" class="side-drawer__footer" :class="{ 'side-drawer__footer-fixed': isFixed }">
          <slot name="footer"></slot>
        </div>
      </div>
    </div>
  </transition>
</template>

<script setup>
import { ref, computed, watch, nextTick, onMounted, onBeforeUnmount, useSlots } from 'vue'
import Scroll from '../../Modules/Helpers/scroll'

const props = defineProps({
  isOpen: Boolean,
  direction: { type: String, default: 'right' },
  hasSideBtn: Boolean,
  scrollLocked: { type: Boolean, default: true },
  wrapperPadding: { type: String, default: 'py-5' },
  alignTop: Boolean,
  noOverlay: Boolean
})

const slots = useSlots()

const drawerParent = ref(null)
const drawerChild = ref(null)
const drawerBody = ref(null)
const isFixed = ref(false)

const scroll = new Scroll()
let observer = null

const hasHeader = computed(() => !!slots.header)

const hasFooter = computed(() => !!slots.footer)

function stickyFooter() {
  if (!hasFooter.value || !props.isOpen) return
  if (!drawerChild.value || !drawerParent.value) return

  isFixed.value = drawerChild.value.scrollHeight >= drawerParent.value.clientHeight - 30
}

function destroyObserver() {
  if (!observer) return

  observer.disconnect()
  observer = null
}

function initObserver() {
  if (!hasFooter.value || !props.isOpen || !drawerBody.value) return

  destroyObserver()

  const config = {
    subtree: true,
    childList: true,
    threshold: 1.0
  }

  const callback = () => {
    nextTick(() => {
      stickyFooter()
    })
  }

  observer = new MutationObserver(callback)
  observer.observe(drawerBody.value, config)
}

watch(() => props.isOpen, (open) => {
  if (open && props.scrollLocked) {
    scroll.disable()

    nextTick(() => {
      initObserver()
      stickyFooter()
    })
  } else {
    destroyObserver()
    scroll.enable()
  }
})

onMounted(() => {
  nextTick(() => {
    window.addEventListener('resize', stickyFooter)
  })
})

onBeforeUnmount(() => {
  destroyObserver()
  window.removeEventListener('resize', stickyFooter)
  scroll.enable()
})
</script>

<style>
.side-drawer--no-overlay::before,
.side-drawer--no-overlay::after {
  display: none !important;
  content: none !important;
}
</style>
