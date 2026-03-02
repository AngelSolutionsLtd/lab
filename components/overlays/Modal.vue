<template>
  <teleport to="body">
    <div class="modal modal-wrapper" :class="[classes, { 'has-scrollbar': hasScrollBar }]" role="dialog"
      aria-labelledby="modalTitle" aria-describedby="modalDescription">
      <div class="modal__cover" @click.prevent="disabled ? null : close()"></div>

      <div class="modal__body" ref="modal__body" :class="{ 'modal__body-overflow--visible': overflowContents }">
        <div id="modalTitle" class="modal__title" v-if="hasHeader">
          <slot name="header"></slot>
        </div>
        <loader-component v-if="loading" />
        <section v-else id="modalDescription" ref="modalDescription" class="modal__message">
          <slot></slot>
        </section>

        <div class="modal__actions" ref="modal__actions" :class="{ 'modal__actions--fixed': fixedBtn }" v-if="hasFooter">
          <slot name="footer">
            <button type="button" class="button button--cancel--subtle" @click="close">Close</button>
          </slot>
        </div>

        <button v-if="dismissible" class="modal__close button button--icon button--cancel" :class="{ 'muted': disabled }"
          @click.prevent="disabled ? null : close()" aria-label="close modal" type="button">
          <svg focusable="false" aria-hidden="true" role="img" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 48 48">
            <title>Close this dialog</title>
            <g fill="currentColor" id="cancel">
              <polygon id="cancel-2" data-name="cancel" class="cls-1"
                points="43.75 11.22 36.78 4.25 24 17.03 11.22 4.25 4.25 11.22 17.03 24 4.25 36.78 11.22 43.75 24 30.97 36.78 43.75 43.75 36.78 30.97 24 43.75 11.22" />
            </g>
          </svg>
        </button>
      </div>
    </div>
  </teleport>
</template>

<script>
import Scroll from "../Modules/Helpers/scroll";
import Loader from "./misc/LoaderPspLogo.vue";

export default  {
  name: 'Popup',
  emits: ['close', 'closeModal', 'update-fixed-btn'],
  props: {
    dismissible: {
      type: Boolean,
      required: false,
      default: false
    },
    title: {
      type: String,
      required: false,
      default: ''
    },
    overflowContents: {
      type: Boolean,
      required: false,
      default: false
    },
    classes: {
      type: String,
      required: false,
      default: ''
    },
    loading: {
      type: Boolean,
      required: false,
      default: false
    },
    disabled: {
      type: Boolean,
      required: false,
      default: false
    },
    disableScrollFix: {
      type: Boolean,
      required: false,
      default: false
    }
  },
  components: {
    "loader-component": Loader
  },
  data() {
    return {
      bodyElm: null,
      scroll: new Scroll,
      hasScrollBar: false,
      fixedBtn: false,
      infoHeight: 0,
      observer: null,
      hasSlotContent: false,
      scrollbarWidth: 0
    }
  },
  computed: {
    hasHeader() {
      return !!this.$slots['header'];
    },
    hasFooter() {
      return !!this.$slots['footer'];
    }
  },
  methods: {
    close() {
      this.$emit('close');
    },
    toggleBodyClass(className) {
      const body = document.body;
      if (body.classList.contains(className)) {
        body.classList.remove(className);
        return;
      } else {
        body.classList.add(className);
      }
    },
    getScrollbarWidth() {
      // Create an off-screen container
      const outer = document.createElement("div");
      outer.style.visibility = "hidden";
      outer.style.overflow = "scroll"; // Force a scrollbar
      outer.style.width = "100px";
      outer.style.position = "absolute";
      outer.style.top = "-9999px"; // Keep it out of view
      document.body.appendChild(outer);
      // Create an inner div and measure the difference
      const inner = document.createElement("div");
      inner.style.width = "100%";
      outer.appendChild(inner);

      // Scrollbar width is the difference
      const scrollbarWidth = (outer.offsetWidth - inner.offsetWidth);
      // Clean up
      document.body.removeChild(outer);

      // Store the result and calc offset
      this.scrollbarWidth = scrollbarWidth;
      const scrollbarOffset = scrollbarWidth / 2;
      document.documentElement.style.setProperty("--scrollbar-width", `${scrollbarOffset}px`);
      this.hasScrollBar = scrollbarWidth > 0;
    },
    fullHeightScroll() {
      this.$nextTick(() => {
        let isFixed = false;
        if (this.$refs.modal__body && this.$refs.modal__body.clientHeight > window.innerHeight) {
          isFixed = true;
          setTimeout(() => {
            if (this.$refs.modalDescription && this.$refs.modal__actions) {
              this.$refs.modalDescription.style.paddingBottom = `${this.$refs.modal__actions.clientHeight + 43}px`;
            }
          }, 50);
        } else {
          setTimeout(() => {
            if (this.$refs.modalDescription) {
              this.$refs.modalDescription.style.paddingBottom = '0px';
            }
          }, 50);
        }


        this.fixedBtn = isFixed;
        this.$emit("update-fixed-btn", this.fixedBtn);
      });
    },
    checkForSlotContent() {
      const slot = this.$slots.default ? this.$slots.default() : [];

      const checkForContent = (hasContent, node) => {
        return hasContent || node.tag || (node.text && node.text.trim());
      };

      setTimeout(() => {
        if (!this.fixedBtn) this.fullHeightScroll();
      }, 10);

      return slot.reduce(checkForContent, false);
    },
  },
  created() {
    this.hasSlotContent = this.checkForSlotContent();
    this.getScrollbarWidth();
    window.addEventListener("resize", this.getScrollbarWidth);
  },
  mounted() {
    this.fullHeightScroll();
    window.addEventListener("resize", this.fullHeightScroll);
    if (!this.disableScrollFix) {
      this.scroll.disable();
    }
  },
  beforeUpdate() {
    this.hasSlotContent = this.checkForSlotContent();
  },
  beforeUnmount() {
    if (!this.disableScrollFix) {
      this.scroll.enable();
    }
    window.removeEventListener("resize", this.getScrollbarWidth);
    window.removeEventListener("resize", this.fullHeightScroll);
  },
  watch: {
    infoHeight() {
      this.fullHeightScroll();
    }
  }
}


</script>
