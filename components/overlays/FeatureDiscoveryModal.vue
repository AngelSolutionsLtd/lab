<template>
  <Teleport to="body">
    <Transition name="modal-fade">
      <div
        v-if="isVisible"
        class="feature-discovery-overlay"
        @click.self="handleDismiss"
      >
        <div class="feature-discovery-modal" role="dialog" :aria-label="feature.title">
          <button
            class="feature-discovery-modal__close"
            @click="handleDismiss"
            aria-label="Close"
            type="button"
          >
            ×
          </button>

          <!-- Main Content -->
          <div v-if="!showingTour" class="feature-discovery-modal__content">
            <!-- Icon/Illustration -->
            <div class="feature-discovery-modal__icon">
              <span class="feature-discovery-modal__icon-emoji">{{ feature.icon }}</span>
            </div>

            <!-- Headline -->
            <h2 class="feature-discovery-modal__title">
              {{ feature.title }}
            </h2>

            <!-- Description -->
            <p class="feature-discovery-modal__description">
              {{ feature.description }}
            </p>

            <!-- Benefits List -->
            <ul v-if="feature.benefits && feature.benefits.length" class="feature-discovery-modal__benefits">
              <li
                v-for="(benefit, index) in feature.benefits"
                :key="index"
                class="feature-discovery-modal__benefit"
              >
                <span class="feature-discovery-modal__benefit-icon">✓</span>
                {{ benefit }}
              </li>
            </ul>

            <!-- Actions -->
            <div class="feature-discovery-modal__actions">
              <button
                class="btn btn--primary"
                @click="startTour"
                type="button"
              >
                {{ feature.tourCta || 'Show me how' }}
              </button>
              <button
                class="btn btn--tertiary"
                @click="handleDismiss"
                type="button"
              >
                Maybe later
              </button>
            </div>
          </div>

          <!-- Tour Steps -->
          <div v-else class="feature-discovery-modal__tour">
            <div class="feature-discovery-modal__tour-progress">
              <div
                v-for="(step, index) in feature.tourSteps"
                :key="index"
                class="feature-discovery-modal__tour-dot"
                :class="{ 'is-active': index === currentStepIndex }"
              ></div>
            </div>

            <div class="feature-discovery-modal__tour-step">
              <div class="feature-discovery-modal__tour-number">
                Step {{ currentStepIndex + 1 }} of {{ feature.tourSteps.length }}
              </div>

              <h3 class="feature-discovery-modal__tour-title">
                {{ currentStep.title }}
              </h3>

              <p class="feature-discovery-modal__tour-description">
                {{ currentStep.description }}
              </p>

              <!-- Optional Tour Step Image/Illustration -->
              <div
                v-if="currentStep.image"
                class="feature-discovery-modal__tour-image"
              >
                <img :src="currentStep.image" :alt="currentStep.title" />
              </div>
            </div>

            <div class="feature-discovery-modal__tour-actions">
              <button
                v-if="currentStepIndex > 0"
                class="btn btn--tertiary"
                @click="previousStep"
                type="button"
              >
                Back
              </button>
              <button
                v-if="currentStepIndex < feature.tourSteps.length - 1"
                class="btn btn--primary"
                @click="nextStep"
                type="button"
              >
                Next
              </button>
              <button
                v-else
                class="btn btn--primary"
                @click="completeTour"
                type="button"
              >
                Got it!
              </button>
            </div>
          </div>
        </div>
      </div>
    </Transition>
  </Teleport>
</template>

<script setup>
import { ref, computed, onMounted, watch } from 'vue';

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
    validator: (value) => {
      return value.title && value.description && value.icon;
    }
  },
  dismissBehavior: {
    type: String,
    default: 'session', // 'session', 'permanent', 'temporary'
    validator: (value) => ['session', 'permanent', 'temporary', 'none'].includes(value)
  },
  dismissDurationDays: {
    type: Number,
    default: 7
  }
});

const emit = defineEmits(['dismiss', 'tour-start', 'tour-complete', 'tour-step']);

// State
const isVisible = ref(false);
const showingTour = ref(false);
const currentStepIndex = ref(0);

// Computed
const storageKey = computed(() => `featureDiscovery:${props.id}`);
const currentStep = computed(() => {
  if (!props.feature.tourSteps || !props.feature.tourSteps.length) return null;
  return props.feature.tourSteps[currentStepIndex.value];
});

// Methods
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

      // Temporary dismissal with expiry
      const dismissedAt = data.dismissedAt;
      const expiryTime = dismissedAt + (props.dismissDurationDays * 24 * 60 * 60 * 1000);
      const isExpired = Date.now() > expiryTime;

      if (isExpired) {
        localStorage.removeItem(storageKey.value);
        return false;
      }

      return true;
    } catch (e) {
      console.error('Error reading dismissal state:', e);
      return false;
    }
  }

  return false;
};

const storeDismissal = () => {
  const data = { dismissedAt: Date.now() };

  if (props.dismissBehavior === 'session') {
    sessionStorage.setItem(storageKey.value, JSON.stringify(data));
  } else if (props.dismissBehavior === 'permanent' || props.dismissBehavior === 'temporary') {
    try {
      localStorage.setItem(storageKey.value, JSON.stringify(data));
    } catch (e) {
      console.error('Error storing dismissal state:', e);
    }
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
  if (!props.feature.tourSteps || !props.feature.tourSteps.length) {
    console.warn('No tour steps defined');
    handleDismiss();
    return;
  }

  showingTour.value = true;
  currentStepIndex.value = 0;
  emit('tour-start', { id: props.id, timestamp: Date.now() });
};

const nextStep = () => {
  if (currentStepIndex.value < props.feature.tourSteps.length - 1) {
    currentStepIndex.value++;
    emit('tour-step', {
      id: props.id,
      stepIndex: currentStepIndex.value,
      timestamp: Date.now()
    });
  }
};

const previousStep = () => {
  if (currentStepIndex.value > 0) {
    currentStepIndex.value--;
    emit('tour-step', {
      id: props.id,
      stepIndex: currentStepIndex.value,
      timestamp: Date.now()
    });
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

// Lifecycle
onMounted(() => {
  if (props.enabled) {
    show();
  }
});

watch(() => props.enabled, (newValue) => {
  if (newValue) {
    show();
  } else {
    isVisible.value = false;
  }
});
</script>

<style scoped>
.feature-discovery-overlay {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(0, 0, 0, 0.5);
  backdrop-filter: blur(4px);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 10000;
  padding: 20px;
}

.feature-discovery-modal {
  position: relative;
  background: white;
  border-radius: 16px;
  box-shadow: 0 20px 60px rgba(0, 0, 0, 0.3);
  max-width: 560px;
  width: 100%;
  max-height: 90vh;
  overflow-y: auto;
  font-family: 'Open Sans', sans-serif;
  animation: modal-slide-up 0.3s ease-out;
}

@keyframes modal-slide-up {
  from {
    transform: translateY(20px);
    opacity: 0;
  }
  to {
    transform: translateY(0);
    opacity: 1;
  }
}

.feature-discovery-modal__close {
  position: absolute;
  top: 16px;
  right: 16px;
  background: rgba(0, 0, 0, 0.05);
  border: none;
  font-size: 28px;
  line-height: 1;
  color: #666;
  cursor: pointer;
  padding: 0;
  width: 32px;
  height: 32px;
  display: flex;
  align-items: center;
  justify-content: center;
  border-radius: 50%;
  transition: all 0.2s;
  z-index: 1;
}

.feature-discovery-modal__close:hover {
  background-color: rgba(0, 0, 0, 0.1);
  color: #1a1a1a;
  transform: rotate(90deg);
}

.feature-discovery-modal__content {
  padding: 48px 40px 40px;
  text-align: center;
}

.feature-discovery-modal__icon {
  margin-bottom: 24px;
}

.feature-discovery-modal__icon-emoji {
  font-size: 64px;
  line-height: 1;
  display: inline-block;
  animation: bounce-in 0.6s ease-out;
}

@keyframes bounce-in {
  0% {
    transform: scale(0);
  }
  50% {
    transform: scale(1.1);
  }
  100% {
    transform: scale(1);
  }
}

.feature-discovery-modal__title {
  margin: 0 0 16px;
  font-size: 28px;
  font-weight: 700;
  color: #1a1a1a;
  line-height: 1.3;
}

.feature-discovery-modal__description {
  margin: 0 0 24px;
  font-size: 16px;
  line-height: 1.6;
  color: #4a4a4a;
}

.feature-discovery-modal__benefits {
  list-style: none;
  padding: 0;
  margin: 0 0 32px;
  text-align: left;
}

.feature-discovery-modal__benefit {
  display: flex;
  align-items: flex-start;
  gap: 12px;
  padding: 10px 0;
  font-size: 15px;
  color: #2a2a2a;
  line-height: 1.5;
}

.feature-discovery-modal__benefit-icon {
  flex-shrink: 0;
  width: 20px;
  height: 20px;
  background: #10b981;
  color: white;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 12px;
  font-weight: bold;
  margin-top: 2px;
}

.feature-discovery-modal__actions {
  display: flex;
  flex-direction: column;
  gap: 12px;
}

.feature-discovery-modal__actions .btn {
  width: 100%;
  padding: 14px 24px;
  font-size: 16px;
  font-weight: 600;
}

/* Tour Styles */
.feature-discovery-modal__tour {
  padding: 40px;
}

.feature-discovery-modal__tour-progress {
  display: flex;
  justify-content: center;
  gap: 8px;
  margin-bottom: 32px;
}

.feature-discovery-modal__tour-dot {
  width: 8px;
  height: 8px;
  border-radius: 50%;
  background: #d0d0d0;
  transition: all 0.3s;
}

.feature-discovery-modal__tour-dot.is-active {
  width: 24px;
  border-radius: 4px;
  background: #0066cc;
}

.feature-discovery-modal__tour-number {
  font-size: 13px;
  font-weight: 600;
  color: #0066cc;
  text-transform: uppercase;
  letter-spacing: 0.5px;
  margin-bottom: 16px;
}

.feature-discovery-modal__tour-title {
  margin: 0 0 16px;
  font-size: 24px;
  font-weight: 700;
  color: #1a1a1a;
  line-height: 1.3;
}

.feature-discovery-modal__tour-description {
  margin: 0 0 24px;
  font-size: 16px;
  line-height: 1.6;
  color: #4a4a4a;
}

.feature-discovery-modal__tour-image {
  margin-bottom: 24px;
  border-radius: 12px;
  overflow: hidden;
  background: #f5f5f5;
}

.feature-discovery-modal__tour-image img {
  width: 100%;
  height: auto;
  display: block;
}

.feature-discovery-modal__tour-actions {
  display: flex;
  gap: 12px;
  justify-content: space-between;
}

.feature-discovery-modal__tour-actions .btn {
  flex: 1;
  padding: 12px 24px;
  font-size: 15px;
  font-weight: 600;
}

/* Transitions */
.modal-fade-enter-active,
.modal-fade-leave-active {
  transition: opacity 0.3s ease;
}

.modal-fade-enter-from,
.modal-fade-leave-to {
  opacity: 0;
}

.modal-fade-enter-active .feature-discovery-modal,
.modal-fade-leave-active .feature-discovery-modal {
  transition: transform 0.3s ease;
}

.modal-fade-enter-from .feature-discovery-modal {
  transform: scale(0.9) translateY(20px);
}

.modal-fade-leave-to .feature-discovery-modal {
  transform: scale(0.9) translateY(20px);
}

/* Responsive */
@media (max-width: 640px) {
  .feature-discovery-modal__content {
    padding: 40px 24px 32px;
  }

  .feature-discovery-modal__tour {
    padding: 32px 24px;
  }

  .feature-discovery-modal__title {
    font-size: 24px;
  }

  .feature-discovery-modal__tour-title {
    font-size: 20px;
  }

  .feature-discovery-modal__icon-emoji {
    font-size: 48px;
  }
}
</style>
