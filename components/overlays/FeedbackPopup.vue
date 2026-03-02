<template>
  <Teleport to="body">
    <Transition name="nudge-fade">
      <div
        v-if="isVisible"
        class="feedback-popup"
        :class="`feedback-popup--${position}`"
        role="dialog"
        aria-label="Feedback"
      >
        <div class="feedback-popup__content">
          <div class="feedback-popup__header">
            <h3 class="feedback-popup__title">{{ message }}</h3>
            <button
              class="feedback-popup__close"
              @click="handleDismiss"
              aria-label="Close"
              type="button"
            >
              ×
            </button>
          </div>

          <!-- Star Rating -->
          <div v-if="showRatingStep && ratingType === 'stars'" class="feedback-popup__stars">
            <button
              v-for="star in 5"
              :key="star"
              class="feedback-popup__star"
              :class="{ 'feedback-popup__star--active': hoveredStar >= star }"
              @mouseenter="hoveredStar = star"
              @mouseleave="hoveredStar = 0"
              @click="handleRatingSelect(star)"
              type="button"
              :aria-label="`Rate ${star} stars`"
            >
              <i :class="hoveredStar >= star ? 'entypo--star' : 'entypo--star-empty'"></i>
            </button>
          </div>

          <!-- Thumbs Rating -->
          <div v-else-if="showRatingStep && ratingType === 'thumbs'" class="feedback-popup__thumbs">
            <button
              class="feedback-popup__thumb feedback-popup__thumb--up"
              :class="{ 'feedback-popup__thumb--active': hoveredThumb === 'up' }"
              @mouseenter="hoveredThumb = 'up'"
              @mouseleave="hoveredThumb = null"
              @click="handleRatingSelect('up')"
              type="button"
              aria-label="Thumbs up"
            >
              <i :class="hoveredThumb === 'up' ? 'entypo--thumbs-up' : 'entypo--thumbs-up-empty'"></i>
            </button>
            <button
              class="feedback-popup__thumb feedback-popup__thumb--down"
              :class="{ 'feedback-popup__thumb--active': hoveredThumb === 'down' }"
              @mouseenter="hoveredThumb = 'down'"
              @mouseleave="hoveredThumb = null"
              @click="handleRatingSelect('down')"
              type="button"
              aria-label="Thumbs down"
            >
              <i :class="hoveredThumb === 'down' ? 'entypo--thumbs-down' : 'entypo--thumbs-down-empty'"></i>
            </button>
          </div>

          <!-- Feedback Phase (after rating or ratingType = 'none') -->
          <div v-else-if="!isSubmitted" class="feedback-popup__feedback">
            <p v-if="ratingNote" class="feedback-popup__rating-note">{{ ratingNote }}</p>
            <textarea
              v-if="showTextArea"
              v-model="feedbackText"
              class="feedback-popup__textarea"
              :placeholder="textAreaPlaceholder"
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

          <!-- Final Thank You -->
          <div v-else class="feedback-popup__final-thanks">
            <p class="feedback-popup__thanks-message">{{ thankYouMessage }}</p>
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
  ratingType: {
    type: String,
    default: 'stars',
    validator: (value) => ['stars', 'thumbs', 'none'].includes(value)
  },
  showTextArea: {
    type: Boolean,
    default: true
  },
  textAreaPlaceholder: {
    type: String,
    default: 'Tell us more (optional)...'
  },
  thankYouMessage: {
    type: String,
    default: 'Thanks for your feedback!'
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
const hoveredThumb = ref(null);
const feedbackText = ref('');
const isSubmitted = ref(false);

// Storage key
const storageKey = computed(() => `feedbackPopup:${props.id}`);

// Show rating step when a rating type is selected and no rating chosen yet
const showRatingStep = computed(() =>
  props.ratingType !== 'none' && selectedRating.value === null && !isSubmitted.value
);

// Contextual note shown after rating selection
const ratingNote = computed(() => {
  if (props.ratingType === 'stars' && selectedRating.value !== null) {
    return `Thanks for rating ${selectedRating.value} star${selectedRating.value !== 1 ? 's' : ''}!`;
  }
  if (props.ratingType === 'thumbs' && selectedRating.value !== null) {
    return selectedRating.value === 'up' ? 'Thanks for the thumbs up!' : 'Thanks for the thumbs down!';
  }
  return null;
});

// Reset internal state when key props change (useful in Storybook)
const resetState = () => {
  selectedRating.value = null;
  hoveredStar.value = 0;
  hoveredThumb.value = null;
  feedbackText.value = '';
  isSubmitted.value = false;
};

watch(() => props.ratingType, resetState);
watch(() => props.showTextArea, resetState);

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

  // Skip feedback phase and submit immediately if no textarea
  if (!props.showTextArea) {
    handleSubmit();
  }
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
  // Persistence disabled in Storybook - always show
  // if (checkDismissalState()) return;

  isVisible.value = true;
  emitEvent('impression');
};

// Lifecycle
onMounted(() => {
  show();
});

watch(() => props.enabled, (newValue) => {
  if (newValue) {
    resetState();
    show();
  } else {
    isVisible.value = false;
  }
});
</script>

<style scoped>
.feedback-popup {
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

.feedback-popup--bottom-right {
  right: 20px;
}

.feedback-popup--bottom-left {
  left: 20px;
}

.feedback-popup__content {
  padding: 16px;
}

.feedback-popup__header {
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  margin-bottom: 16px;
}

.feedback-popup__title {
  margin: 0;
  font-size: 15px;
  font-weight: 600;
  color: #1a1a1a;
  line-height: 1.4;
  flex: 1;
  padding-right: 8px;
  font-family: 'Open Sans', sans-serif;
}

.feedback-popup__close {
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

.feedback-popup__close:hover {
  background-color: #f0f0f0;
  color: #1a1a1a;
}

/* Stars */
.feedback-popup__stars {
  display: flex;
  gap: 4px;
  justify-content: center;
}

.feedback-popup__star {
  background: none;
  border: none;
  cursor: pointer;
  padding: 4px;
  border-radius: 4px;
  color: #d0d0d0;
  transition: color 0.2s, transform 0.1s;
  line-height: 1;
}

.feedback-popup__star i {
  font-size: 28px;
  display: block;
}

.feedback-popup__star:hover,
.feedback-popup__star--active {
  transform: scale(1.1);
}

.feedback-popup__star--active i,
.feedback-popup__star:hover i {
  color: #ffc107;
}

/* Thumbs */
.feedback-popup__thumbs {
  display: flex;
  gap: 16px;
  justify-content: center;
  padding: 4px 0;
}

.feedback-popup__thumb {
  background: none;
  border: 2px solid #e0e0e0;
  border-radius: 50%;
  width: 64px;
  height: 64px;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  color: #999;
  transition: all 0.2s;
}

.feedback-popup__thumb i {
  font-size: 28px;
  display: block;
}

.feedback-popup__thumb--up:hover,
.feedback-popup__thumb--up.feedback-popup__thumb--active {
  border-color: #22c55e;
  color: #22c55e;
  background-color: #f0fdf4;
  transform: scale(1.08);
}

.feedback-popup__thumb--down:hover,
.feedback-popup__thumb--down.feedback-popup__thumb--active {
  border-color: #ef4444;
  color: #ef4444;
  background-color: #fef2f2;
  transform: scale(1.08);
}

/* Feedback form */
.feedback-popup__feedback {
  display: flex;
  flex-direction: column;
  gap: 12px;
}

.feedback-popup__rating-note {
  margin: 0;
  font-size: 14px;
  color: #4a4a4a;
  text-align: center;
  font-family: 'Open Sans', sans-serif;
}

.feedback-popup__final-thanks {
  display: flex;
  justify-content: center;
  align-items: center;
  padding: 20px 0;
}

.feedback-popup__thanks-message {
  margin: 0;
  font-size: 15px;
  font-weight: 600;
  color: #0066cc;
  text-align: center;
  font-family: 'Open Sans', sans-serif;
}

.feedback-popup__textarea {
  width: 100%;
  padding: 8px 12px;
  border: 1px solid #d0d0d0;
  border-radius: 6px;
  font-family: 'Open Sans', sans-serif;
  font-size: 14px;
  color: #1a1a1a;
  resize: vertical;
  transition: border-color 0.2s;
  box-sizing: border-box;
}

.feedback-popup__textarea:focus {
  outline: none;
  border-color: #0066cc;
}

.feedback-popup__textarea::placeholder {
  color: #999;
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
