<!--TODO: programmatically pause scroll at current point -->
<!--TODO: programmatically keep looping focus inside the modal -->
<template>
    <portal to="modal">
      <div class="modal" :class="[ classes, {'has-scrollbar': hasScrollBar} ]" role="dialog" aria-labelledby="modalTitle"
           aria-describedby="modalDescription">
        <div class="modal__cover" @click.prevent="disabled ? null : close()"></div>
  
        <div class="modal__body" ref="modal__body" :class="{ 'modal__body-overflow--visible': overflowContents }">
          <div id="modalTitle" class="modal__title" v-if="hasHeader">
            <slot name="header">
            </slot>
          </div>
          <loader-component v-if="loading" />
          <section v-else id="modalDescription" ref="modalDescription" class="modal__message">
            <slot>
            </slot>
          </section>
  
          <div class="modal__actions" ref="modal__actions" :class="{'modal__actions--fixed': fixedBtn}" v-if="hasFooter">
            <slot name="footer">
              <button type="button" class="button button--cancel--subtle" @click="close">Close</button>
            </slot>
          </div>
  
          <button v-if="dismissible" class="modal__close button button--icon button--cancel"  :class="{'muted': disabled}" @click.prevent="disabled ? null : close()" aria-label="close modal" type="button">
            <svg focusable="false" aria-hidden="true" role="img" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 48 48">
              <title>Close this dialog</title>
              <g fill="currentColor" id="cancel"><polygon id="cancel-2" data-name="cancel" class="cls-1" points="43.75 11.22 36.78 4.25 24 17.03 11.22 4.25 4.25 11.22 17.03 24 4.25 36.78 11.22 43.75 24 30.97 36.78 43.75 43.75 36.78 30.97 24 43.75 11.22" /></g>
            </svg>
          </button>
        </div>
  
      </div>
    </portal>
  </template>
  
  <script type="text/javascript">
    import Scroll from "../Modules/Helpers/scroll";
    import Loader from "../components/misc/LoaderPspLogo"
  
    export default {
      name: 'Popup',
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
        close: function () {
          this.$emit('close');
        },
        toggleBodyClass(className) {
          const body = document.body;
  
          if (body.classList.contains(className)) {
            body.classList.remove(className);
            return
          } else {
            body.classList.add(className);
          }
        },
        getScrollbarWidth() {
  
          // Creating invisible container
          const outer = document.createElement('div');
          outer.style.visibility = 'hidden';
          outer.style.overflow = 'scroll'; // forcing scrollbar to appear
          outer.style.msOverflowStyle = 'scrollbar'; // needed for WinJS apps
          document.body.appendChild(outer);
  
          // Creating inner element and placing it in the container
          const inner = document.createElement('div');
          outer.appendChild(inner);
          
          // Calculating difference between container's full width and the child width
          const scrollbarWidth = (outer.offsetWidth - inner.offsetWidth);
  
          // Removing temporary elements from the DOM
          outer.parentNode.removeChild(outer); 
          if(scrollbarWidth > 0) {
            this.hasScrollBar = true
          }			
                 
        },
        fullHeightScroll() {
          this.$nextTick(() => {
            if(this.$refs.modal__body && this.$refs.modal__body.clientHeight > window.innerHeight) {
                this.fixedBtn = true
                // add the relevant padding to prevent elements hiding behind footer.
                // output is 120
                setTimeout(() => this.$refs.modalDescription.style.paddingBottom  = (this.$refs.modal__actions.clientHeight + 43) + 'px', 50)
            } else {
              this.fixedBtn = false
            }
          });
        },
        checkForSlotContent() {
            let checkForContent = (hasContent, node) => {
                return hasContent || node.tag || (node.text && node.text.trim());
            }
  
            setTimeout(() => {if(!this.fixedBtn) this.fullHeightScroll()}, 10)
  
            return this.$slots.default && this.$slots.default.reduce(checkForContent, false);
        },      
      },
      created() {
        this.hasSlotContent = this.checkForSlotContent();
        this.getScrollbarWidth()
            window.addEventListener("resize", this.getScrollbarWidth);
      },
      mounted() {
        this.fullHeightScroll()
        window.addEventListener("resize", this.fullHeightScroll);
        this.scroll.disable();
      },
      beforeUpdate() {
          this.hasSlotContent = this.checkForSlotContent();
      },    
      beforeDestroy() {
        this.scroll.enable();
        window.removeEventListener("resize", this.getScrollbarWidth);
        window.removeEventListener("resize", this.fullHeightScroll);
      },
      watch: { 
        infoHeight() {
          this.fullHeightScroll()
        }
      }
  }
  
  </script>
  
<style lang="scss">
// TODO: Review this - may be better to programatically pause scrolling or use vue portals to place modals at top of dom to always come first in stacking context.
.modal-is-open {
  overflow: hidden;

  // TODO: Review this - puts sticky nav behind page/modal content
  .admin-menu-holder,
  .admin-menu,
  .page-header img,
  .page-footer {
    z-index: 0;
  }
  .admin-menu-holder .page-nav-stuck {
    height: 0;
  }
  // put sticky Help button (in bottom corner) behind page/modal content
  #launcher {
    z-index: 0 !important;
  }
}

.modal {
  display: flex;
  align-items: center;
  height: 100%;
  width: 100%;
  position: fixed;
  top: 0;
  left: 0;
  z-index: 10000;
  font-size: 16px;

  &--rounded {
    .modal__body {
      border-radius: 20px;
    }
  }

  &--wide {
    .modal__body {
      max-width: 75%;
    }

    .modal__message {
      max-width: 94%;
    }
  }

  &--small {
    .modal__body {
      max-width: 50%;
    }
  }

  &__cover {
    position: fixed;
    top: 0;
    bottom: 0;
    left: 0;
    right: 0;
    width: 100%;
    height: 100%;
    background-color: black;
    opacity: .8;
    // z-index: 301;
  }

  &__body {
    // position: fixed;
    position: relative;
    // top: 5%;
    // left: 0;
    // right: 0;
    width: 95%;
    height: auto;
    max-width: 800px;
    max-height: 84vh;
    margin: 2em auto 0 auto;
    border-radius: 2px;
    background: white;
    z-index: 301;
    overflow: auto;
    text-align: center;
    padding: 20px 10px 10px 10px;
    animation: zoomIn .25s ease;
    
    &-overflow--visible {
     overflow: visible;
    }


    ul {
      margin: 20px 0;
      text-align: left;
      list-style: none;
      padding: 0;
      li {
        position: relative;
        padding-left: 20px;
        font-weight: bolder;
        &:before {
          content: '';
          width: 8px;
          height: 8px;
          background: #698bab;
          position: absolute;
          left: 0;
          top: 50%;
          transform: translateY(-50%);
        }
      }
    }
  }
  &__title {
    padding: 0 30px;
    margin: 0 auto;
    max-width: 760px;
    * {
      text-transform: uppercase;
      letter-spacing: 0.02em;
      font-family: 'Open Sans';
      font-weight: bold;
      margin-bottom: 20px;
      line-height: 1.2;
      font-size: 22px;
    }
  }
  &__message {
    margin: 0 auto;
    max-width: 700px;
    margin-bottom: 30px;
    line-height: 1.8;

    &--align-left {
      text-align: left;
    }

    .modal__message--primary {
      font-size: 1.1em;
    }

    .modal__message--smallprint {
      font-size: 0.95em;
    }

    p {
      margin-bottom: 1em;

      &:last-of-type {
        margin-bottom: 0;
      }
    }
  }
  &__actions {
    margin: 0 auto;
    max-width: 700px;
    display: flex;
    justify-content: center;
    align-items: center;
    flex-wrap: wrap;
    width: auto;
    padding-bottom: 10px;

    .button {
      margin: 10px 10px 0 10px;
      &:first-of-type {
        margin-left: 0;
      }
      &:last-of-type {
        margin-right: 0;
      }
    }
    &--align-left {
      justify-content: flex-start;
    }
    &--align-right {
      justify-content: flex-end;
    }
  }
  &__close {
    position: absolute;
    right: 15px;
    top: 15px;
    font-size: 24px;
    line-height: 1;
  }
  &.text--left,
  &--align-left {
    .modal__body {
      text-align: left;
    }
    .modal__title {
      max-width: 700px;
      padding-left: 0;
    }
    .modal__actions {
      justify-content: flex-start;
    }
  }
}

// ! this is for a vue transition wrapper that would be good to add IF we change the stacking order programatically
.modal-fade-enter,
.modal-fade-leave-active {
  opacity: 0;
}

.modal-fade-enter-active,
.modal-fade-leave-active {
  transition: opacity .5s ease;
}
</style>
