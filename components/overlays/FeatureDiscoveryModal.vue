<template>
  <Teleport to="body">
    <Transition name="modal-fade">
      <div
        v-if="isVisible"
        class="feature-discovery-overlay"
        @click.self="handleDismiss"
      >
        <div
          class="feature-discovery-modal"
          :class="{ 'feature-discovery-modal--wide': showingTour }"
          :style="[
            showingTour ? { maxWidth: feature.tourMaxWidth || '900px' } : {},
            feature.accentGradient ? {
              border: '2px solid transparent',
              backgroundImage: `linear-gradient(white, white), ${feature.accentGradient}`,
              backgroundClip: 'padding-box, border-box',
              backgroundOrigin: 'border-box'
            } : {}
          ]"
          role="dialog"
          :aria-label="feature.title"
        >
          <button
            class="feature-discovery-modal__close"
            @click="handleDismiss"
            aria-label="Close"
            type="button"
          >
            <i class="entypo--cancel"></i>
          </button>

          <!-- Intro screen -->
          <div v-if="!showingTour" class="feature-discovery-modal__content">
            <div class="feature-discovery-modal__icon">
              <i
                :class="['feature-discovery-modal__icon-glyph', feature.icon]"
                :style="feature.accentGradient ? { background: feature.accentGradient, color: 'white' } : {}"
              ></i>
            </div>

            <h2 class="feature-discovery-modal__title">{{ feature.title }}</h2>

            <p class="feature-discovery-modal__description">{{ feature.description }}</p>

            <ul v-if="feature.benefits && feature.benefits.length" class="feature-discovery-modal__benefits">
              <li
                v-for="(benefit, index) in feature.benefits"
                :key="index"
                class="feature-discovery-modal__benefit"
              >
                <i class="entypo--check feature-discovery-modal__benefit-icon"></i>
                {{ benefit }}
              </li>
            </ul>

            <div class="feature-discovery-modal__actions">
              <button :class="['btn', feature.ctaClass || 'btn--secondary']" @click="startTour" type="button">
                <i v-if="feature.ctaIcon" :class="feature.ctaIcon"></i>
                {{ feature.tourCta || 'Show me how' }}
              </button>
              <button class="btn btn--tertiary" @click="handleDismiss" type="button">
                Maybe later
              </button>
            </div>
          </div>

          <!-- Tour -->
          <div v-else class="feature-discovery-modal__tour" :class="{ 'feature-discovery-modal__tour--stacked': feature.tourLayout === 'stacked' }">
            <!-- Left: image panel (split layout only) -->
            <div v-if="feature.tourLayout !== 'stacked'" class="feature-discovery-modal__tour-media">
              <img
                v-if="currentStep.image"
                :src="currentStep.image"
                :alt="currentStep.title"
                class="feature-discovery-modal__tour-media-img"
              />
              <div
                v-else
                class="feature-discovery-modal__tour-media-placeholder"
                :style="feature.accentGradient ? { background: feature.accentGradient } : {}"
              >
                <i
                  :class="['feature-discovery-modal__tour-media-icon', feature.icon]"
                  :style="feature.accentGradient ? { color: 'white', opacity: '0.9' } : {}"
                ></i>
              </div>
            </div>

            <!-- Content body -->
            <div class="feature-discovery-modal__tour-body">
              <div class="feature-discovery-modal__tour-step">
                <div class="feature-discovery-modal__tour-number">
                  Step {{ currentStepIndex + 1 }} of {{ feature.tourSteps.length }}
                </div>
                <h3 class="feature-discovery-modal__tour-title">{{ currentStep.title }}</h3>
                <p v-if="currentStep.description" class="feature-discovery-modal__tour-description">{{ currentStep.description }}</p>
                <ul v-if="currentStep.points && currentStep.points.length" class="feature-discovery-modal__tour-points">
                  <li v-for="(point, i) in currentStep.points" :key="i" class="feature-discovery-modal__tour-point">
                    {{ point }}
                  </li>
                </ul>
              </div>

              <div class="feature-discovery-modal__tour-footer">
                <div class="feature-discovery-modal__tour-progress">
                  <div
                    v-for="(step, index) in feature.tourSteps"
                    :key="index"
                    class="feature-discovery-modal__tour-dot"
                    :class="{ 'is-active': index === currentStepIndex }"
                    :style="index === currentStepIndex && feature.accentGradient ? { background: feature.accentGradient } : {}"
                  ></div>
                </div>
                <div class="feature-discovery-modal__tour-actions">
                  <button
                    v-if="currentStepIndex > 0"
                    class="btn btn--tertiary"
                    @click="previousStep"
                    type="button"
                  >
                    <i class="entypo--left-open"></i> Back
                  </button>
                  <button
                    v-if="currentStepIndex < feature.tourSteps.length - 1"
                    :class="['btn', feature.ctaClass || 'btn--secondary']"
                    @click="nextStep"
                    type="button"
                  >
                    Next <i class="entypo--right-open"></i>
                  </button>
                  <button
                    v-else
                    :class="['btn', feature.ctaClass || 'btn--secondary']"
                    @click="completeTour"
                    type="button"
                  >
                    <i class="entypo--check"></i> Got it!
                  </button>
                </div>
              </div>
            </div>
          </div>

        </div>
      </div>
    </Transition>
  </Teleport>
</template>

<script setup>
import { ref, computed, onMounted, watch } from 'vue';
import '../../fonts/style.css';

const props = defineProps({
  id: {
    type: String,
    required: true
  },
  enabled: {
    type: Boolean,
    default: false
  },
  feature: {
    type: Object,
    required: true,
    validator: (value) => value.title && value.description && value.icon
  },
  dismissBehavior: {
    type: String,
    default: 'session',
    validator: (value) => ['session', 'permanent', 'temporary', 'none'].includes(value)
  },
  dismissDurationDays: {
    type: Number,
    default: 7
  }
});

const emit = defineEmits(['dismiss', 'tour-start', 'tour-complete', 'tour-step']);

const isVisible = ref(false);
const showingTour = ref(false);
const currentStepIndex = ref(0);

const storageKey = computed(() => `featureDiscovery:${props.id}`);
const currentStep = computed(() => {
  if (!props.feature.tourSteps?.length) return null;
  return props.feature.tourSteps[currentStepIndex.value];
});

const checkDismissalState = () => {
  if (props.dismissBehavior === 'none') return false;
  if (props.dismissBehavior === 'session') {
    return sessionStorage.getItem(storageKey.value) !== null;
  }
  if (props.dismissBehavior === 'permanent' || props.dismissBehavior === 'temporary') {
    try {
      const stored = localStorage.getItem(storageKey.value);
      if (!stored) return false;
      const data = JSON.parse(stored);
      if (props.dismissBehavior === 'permanent') return true;
      const isExpired = Date.now() > data.dismissedAt + (props.dismissDurationDays * 86400000);
      if (isExpired) { localStorage.removeItem(storageKey.value); return false; }
      return true;
    } catch (e) {
      return false;
    }
  }
  return false;
};

const storeDismissal = () => {
  const data = { dismissedAt: Date.now() };
  if (props.dismissBehavior === 'session') {
    sessionStorage.setItem(storageKey.value, JSON.stringify(data));
  } else if (['permanent', 'temporary'].includes(props.dismissBehavior)) {
    try { localStorage.setItem(storageKey.value, JSON.stringify(data)); } catch (e) {}
  }
};

const handleDismiss = () => {
  isVisible.value = false;
  showingTour.value = false;
  currentStepIndex.value = 0;
  storeDismissal();
  emit('dismiss', { id: props.id, timestamp: Date.now() });
};

const startTour = () => {
  if (!props.feature.tourSteps?.length) { handleDismiss(); return; }
  showingTour.value = true;
  currentStepIndex.value = 0;
  emit('tour-start', { id: props.id, timestamp: Date.now() });
};

const nextStep = () => {
  if (currentStepIndex.value < props.feature.tourSteps.length - 1) {
    currentStepIndex.value++;
    emit('tour-step', { id: props.id, stepIndex: currentStepIndex.value, timestamp: Date.now() });
  }
};

const previousStep = () => {
  if (currentStepIndex.value > 0) {
    currentStepIndex.value--;
    emit('tour-step', { id: props.id, stepIndex: currentStepIndex.value, timestamp: Date.now() });
  }
};

const completeTour = () => {
  emit('tour-complete', { id: props.id, timestamp: Date.now() });
  handleDismiss();
};

const show = () => {
  if (checkDismissalState()) return;
  isVisible.value = true;
};

onMounted(() => { if (props.enabled) show(); });

watch(() => props.enabled, (val) => {
  if (val) show();
  else isVisible.value = false;
});
</script>

<style scoped>
.feature-discovery-overlay {
  position: fixed;
  inset: 0;
  background: rgba(0, 0, 0, 0.45);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 10000;
  padding: 20px;
}

.feature-discovery-modal {
  position: relative;
  background: white;
  border-radius: 6px;
  box-shadow: 0 8px 32px rgba(0, 0, 0, 0.22);
  max-width: 560px;
  width: 100%;
  max-height: 90vh;
  overflow: hidden;
  font-family: 'Open Sans', sans-serif;
}



/* Close */
.feature-discovery-modal__close {
  position: absolute;
  top: 12px;
  right: 12px;
  background: none;
  border: none;
  color: #888;
  cursor: pointer;
  width: 28px;
  height: 28px;
  display: flex;
  align-items: center;
  justify-content: center;
  border-radius: 4px;
  transition: background 0.15s, color 0.15s;
  z-index: 1;
  font-size: 16px;
}
.feature-discovery-modal__close:hover {
  background: #f0f0f0;
  color: #333;
}

/* ── Intro screen ── */
.feature-discovery-modal__content {
  padding: 40px 40px 32px;
  text-align: center;
  display: flex;
  flex-direction: column;
  align-items: center;
}

.feature-discovery-modal__icon {
  margin-bottom: 16px;
}

.feature-discovery-modal__icon-glyph {
  font-size: 32px;
  width: 64px;
  height: 64px;
  line-height: 64px;
  display: inline-block;
  text-align: center;
  border-radius: 50%;
  background: #e4eaee;
  color: #2c3e4f;
}

.feature-discovery-modal__title {
  margin: 0 0 10px;
  font-size: 20px;
  font-weight: 700;
  color: #222;
  line-height: 1.3;
}

.feature-discovery-modal__description {
  margin: 0 0 20px;
  font-size: 14px;
  line-height: 1.6;
  color: #555;
  max-width: 440px;
}

.feature-discovery-modal__benefits {
  list-style: none;
  padding: 0;
  margin: 0 0 28px;
  text-align: left;
  width: 100%;
}

.feature-discovery-modal__benefit {
  display: flex;
  align-items: flex-start;
  gap: 10px;
  padding: 8px 0;
  font-size: 14px;
  color: #333;
  line-height: 1.4;
  border-top: 1px solid #f0f0f0;
}
.feature-discovery-modal__benefit:last-child {
  border-bottom: 1px solid #f0f0f0;
}

.feature-discovery-modal__benefit-icon {
  flex-shrink: 0;
  font-size: 16px;
  color: #2c3e4f;
  margin-top: 1px;
}

.feature-discovery-modal__actions {
  display: flex;
  flex-direction: column;
  gap: 8px;
  width: 100%;
  padding-top: 4px;
}
.feature-discovery-modal__actions .btn {
  width: 100%;
}

/* ── Tour: GIF left, content right ── */
.feature-discovery-modal__tour {
  display: flex;
  flex-direction: row;
  align-items: stretch;
}

/* Stacked layout — no media panel, full-width content */
.feature-discovery-modal__tour--stacked {
  flex-direction: column;
}

.feature-discovery-modal__tour--stacked .feature-discovery-modal__tour-body {
  flex: 1;
}

.feature-discovery-modal__tour--stacked .feature-discovery-modal__tour-step {
  padding: 28px 36px 12px;
}

.feature-discovery-modal__tour--stacked .feature-discovery-modal__tour-footer {
  padding: 14px 36px;
}

/* Left image panel — width drives the natural GIF height for both sides */
.feature-discovery-modal__tour-media {
  width: 55%;
  flex-shrink: 0;
  background: #f0f2f5;
  border-right: 1px solid #e8e8e8;
  overflow: hidden;
  display: flex;
  align-items: center;
  justify-content: center;
}

.feature-discovery-modal__tour-media-img {
  width: 100%;
  height: 100%;
  object-fit: contain;
  display: block;
}

.feature-discovery-modal__tour-media-placeholder {
  width: 100%;
  height: 100%;
  display: flex;
  align-items: center;
  justify-content: center;
}

.feature-discovery-modal__tour-media-icon {
  font-size: 48px;
  color: #c8d4e0;
}

/* Right content body */
.feature-discovery-modal__tour-body {
  flex: 1;
  display: flex;
  flex-direction: column;
  min-width: 0;
}

.feature-discovery-modal__tour-step {
  flex: 1;
  padding: 24px 24px 12px;
  overflow-y: auto;
}

.feature-discovery-modal__tour-number {
  font-size: 11px;
  font-weight: 700;
  color: #2c3e4f;
  text-transform: uppercase;
  letter-spacing: 0.6px;
  margin-bottom: 10px;
}

.feature-discovery-modal__tour-title {
  margin: 0 0 12px;
  font-size: 20px;
  font-weight: 700;
  color: #222;
  line-height: 1.3;
}

.feature-discovery-modal__tour-description {
  margin: 0;
  font-size: 15px;
  line-height: 1.6;
  color: #555;
}

.feature-discovery-modal__tour-points {
  list-style: disc;
  padding-left: 18px;
  margin: 0;
}

.feature-discovery-modal__tour-point {
  padding: 5px 0;
  font-size: 15px;
  color: #333;
  line-height: 1.5;
}

/* Footer bar */
.feature-discovery-modal__tour-footer {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 14px 28px;
  border-top: 1px solid #f0f0f0;
  flex-shrink: 0;
}

.feature-discovery-modal__tour-progress {
  display: flex;
  align-items: center;
  gap: 6px;
}

.feature-discovery-modal__tour-dot {
  width: 7px;
  height: 7px;
  border-radius: 50%;
  background: #d0d0d0;
  transition: all 0.25s;
}

.feature-discovery-modal__tour-dot.is-active {
  width: 20px;
  border-radius: 4px;
  background: #2c3e4f;
}

.feature-discovery-modal__tour-actions {
  display: flex;
  gap: 8px;
}

/* Transitions */
.modal-fade-enter-active,
.modal-fade-leave-active {
  transition: opacity 0.2s ease;
}
.modal-fade-enter-from,
.modal-fade-leave-to {
  opacity: 0;
}
.modal-fade-enter-active .feature-discovery-modal,
.modal-fade-leave-active .feature-discovery-modal {
  transition: transform 0.2s ease;
}
.modal-fade-enter-from .feature-discovery-modal {
  transform: scale(0.97) translateY(10px);
}
.modal-fade-leave-to .feature-discovery-modal {
  transform: scale(0.97) translateY(10px);
}

/* Responsive — collapse to stacked on small screens */
@media (max-width: 600px) {
  .feature-discovery-modal__tour {
    flex-direction: column;
  }

  .feature-discovery-modal__tour-media {
    width: 100%;
    border-right: none;
    border-bottom: 1px solid #e8e8e8;
  }

  .feature-discovery-modal__tour-step {
    padding: 16px 20px 8px;
  }

  .feature-discovery-modal__tour-footer {
    padding: 12px 20px;
  }

  .feature-discovery-modal__content {
    padding: 32px 24px 24px;
  }
}
</style>
