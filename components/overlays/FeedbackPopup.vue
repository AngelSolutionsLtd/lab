<template>
  <Teleport to="body">
    <Transition name="nudge-fade">
      <div
        v-if="isVisible"
        class="feature-nudge"
        :class="`feature-nudge--${position}`"
        role="dialog"
        aria-label="Feedback"
      >
        <div class="feature-nudge__content">
          <div class="feature-nudge__header">
            <h3 class="feature-nudge__title">{{ message }}</h3>
            <button
              class="feature-nudge__close"
              @click="handleDismiss"
              aria-label="Close"
              type="button"
            >
              ×
            </button>
          </div>

          <!-- Star Rating -->
          <div v-if="!selectedRating && !isSubmitted" class="feature-nudge__stars">
            <button
              v-for="star in 5"
              :key="star"
              class="feature-nudge__star"
              :class="{ 'feature-nudge__star--hover': hoveredStar >= star }"
              @mouseenter="hoveredStar = star"
              @mouseleave="hoveredStar = 0"
              @click="handleRatingSelect(star)"
              type="button"
              :aria-label="`Rate ${star} stars`"
            >
              {{ hoveredStar >= star ? '★' : '☆' }}
            </button>
          </div>

          <!-- Feedback Text Area (shown after rating) -->
          <div v-else-if="selectedRating && !isSubmitted" class="feature-nudge__feedback">
            <p class="feature-nudge__thank-you">Thanks for rating {{ selectedRating }} star{{ selectedRating !== 1 ? 's' : '' }}!</p>
            <textarea
              v-model="feedbackText"
              class="feature-nudge__textarea"
              placeholder="Tell us more (optional)..."
              rows="3"
            ></textarea>
            <button
              class="btn btn--tertiary"
              @click="handleSubmit"
              type="button"
            >
              Submit Feedback
            </button>
          </div>

          <!-- Final Thank You (shown after submission) -->
          <div v-else class="feature-nudge__final-thanks">
            <p class="feature-nudge__thanks-message">Thanks for your feedback!</p>
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
    default: true
  },
  message: {
    type: String,
    default: 'How are you finding Broadcast?'
  },
  position: {
    type: String,
    default: 'bottom-right',
    validator: (value) => ['bottom-right', 'bottom-left'].includes(value)
  },
  dismissal: {
    type: Object,
    default: () => ({
      strategy: 'session',
      ttlHours: null
    })
  }
});

const emit = defineEmits(['impression', 'rating', 'feedback', 'dismiss']);

// State
const isVisible = ref(false);
const selectedRating = ref(null);
const hoveredStar = ref(0);
const feedbackText = ref('');
const isSubmitted = ref(false);

// Storage key
const storageKey = computed(() => `featureNudge:${props.id}`);

// Helper functions
const emitEvent = (eventName, additionalData = {}) => {
  const payload = {
    id: props.id,
    timestamp: Date.now(),
    ...additionalData
  };
  emit(eventName, payload);
};

const checkDismissalState = () => {
  if (!props.dismissal) return false;

  const { strategy, ttlHours } = props.dismissal;

  if (strategy === 'session') {
    return sessionStorage.getItem(storageKey.value) !== null;
  }

  if (strategy === 'localStorage') {
    try {
      const stored = localStorage.getItem(storageKey.value);
      if (!stored) return false;

      const data = JSON.parse(stored);

      if (!ttlHours) return true;

      const dismissedAt = data.dismissedAt;
      const expiryTime = dismissedAt + (ttlHours * 60 * 60 * 1000);
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
  if (!props.dismissal) return;

  const { strategy } = props.dismissal;
  const data = { dismissedAt: Date.now() };

  if (strategy === 'session') {
    sessionStorage.setItem(storageKey.value, JSON.stringify(data));
  } else if (strategy === 'localStorage') {
    try {
      localStorage.setItem(storageKey.value, JSON.stringify(data));
    } catch (e) {
      console.error('Error storing dismissal state:', e);
    }
  }
};

// Event handlers
const handleDismiss = () => {
  isVisible.value = false;
  storeDismissal();
  emitEvent('dismiss');
};

const handleRatingSelect = (rating) => {
  selectedRating.value = rating;
  emitEvent('rating', { rating });
};

const handleSubmit = () => {
  emitEvent('feedback', {
    rating: selectedRating.value,
    feedback: feedbackText.value
  });

  isSubmitted.value = true;

  // Auto-dismiss after 2 seconds
  setTimeout(() => {
    handleDismiss();
  }, 2000);
};

const show = () => {
  if (!props.enabled) return;
  // Persistence disabled - always show
  // if (checkDismissalState()) return;

  isVisible.value = true;
  emitEvent('impression');
};

// Lifecycle
onMounted(() => {
  show();
});

// Watch for enabled changes
watch(() => props.enabled, (newValue) => {
  if (newValue) {
    show();
  } else {
    isVisible.value = false;
  }
});
</script>

<style scoped>
.feature-nudge {
  position: fixed;
  bottom: 20px;
  width: 320px;
  background: white;
  border-radius: 8px;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15), 0 0 0 1px rgba(0, 0, 0, 0.05);
  font-family: 'Open Sans', sans-serif;
  pointer-events: auto;
  z-index: 9999;
}

.feature-nudge--bottom-right {
  right: 20px;
}

.feature-nudge--bottom-left {
  left: 20px;
}

.feature-nudge__content {
  padding: 16px;
}

.feature-nudge__header {
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  margin-bottom: 16px;
}

.feature-nudge__title {
  margin: 0;
  font-size: 15px;
  font-weight: 600;
  color: #1a1a1a;
  line-height: 1.4;
  flex: 1;
  padding-right: 8px;
  font-family: 'Open Sans', sans-serif;
}

.feature-nudge__close {
  background: none;
  border: none;
  font-size: 24px;
  line-height: 1;
  color: #666;
  cursor: pointer;
  padding: 0;
  width: 24px;
  height: 24px;
  display: flex;
  align-items: center;
  justify-content: center;
  border-radius: 4px;
  transition: background-color 0.2s, color 0.2s;
  flex-shrink: 0;
}

.feature-nudge__close:hover {
  background-color: #f0f0f0;
  color: #1a1a1a;
}

.feature-nudge__stars {
  display: flex;
  gap: 8px;
  justify-content: center;
}

.feature-nudge__star {
  background: none;
  border: none;
  font-size: 32px;
  color: #d0d0d0;
  cursor: pointer;
  padding: 0;
  transition: color 0.2s, transform 0.1s;
  line-height: 1;
}

.feature-nudge__star:hover {
  transform: scale(1.1);
}

.feature-nudge__star--hover {
  color: #ffc107;
}

.feature-nudge__feedback {
  display: flex;
  flex-direction: column;
  gap: 12px;
}

.feature-nudge__thank-you {
  margin: 0;
  font-size: 14px;
  color: #4a4a4a;
  text-align: center;
  font-family: 'Open Sans', sans-serif;
}

.feature-nudge__final-thanks {
  display: flex;
  justify-content: center;
  align-items: center;
  padding: 20px 0;
}

.feature-nudge__thanks-message {
  margin: 0;
  font-size: 15px;
  font-weight: 600;
  color: #0066cc;
  text-align: center;
  font-family: 'Open Sans', sans-serif;
}

.feature-nudge__textarea {
  width: 100%;
  padding: 8px 12px;
  border: 1px solid #d0d0d0;
  border-radius: 6px;
  font-family: 'Open Sans', sans-serif;
  font-size: 14px;
  color: #1a1a1a;
  resize: vertical;
  transition: border-color 0.2s;
}

.feature-nudge__textarea:focus {
  outline: none;
  border-color: #0066cc;
}

.feature-nudge__textarea::placeholder {
  color: #999;
}

.feature-nudge__submit {
  background-color: #0066cc;
  color: white;
  border: none;
  border-radius: 6px;
  padding: 10px 16px;
  font-size: 14px;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.2s;
  font-family: 'Open Sans', sans-serif;
}

.feature-nudge__submit:hover {
  background-color: #0052a3;
  transform: translateY(-1px);
  box-shadow: 0 2px 8px rgba(0, 102, 204, 0.3);
}

/* Transitions */
.nudge-fade-enter-active,
.nudge-fade-leave-active {
  transition: opacity 0.3s ease, transform 0.3s ease;
}

.nudge-fade-enter-from {
  opacity: 0;
  transform: translateY(8px);
}

.nudge-fade-leave-to {
  opacity: 0;
  transform: translateY(8px);
}
</style>
