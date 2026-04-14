<template>
  <div class="content-feedback">
    <template v-if="!hasLeftFeedback">
      <p class="content-feedback__question">Was this content useful?</p>
      <div class="content-feedback__actions">
        <button
          class="content-feedback__btn"
          @click="handleFeedback(true)"
          aria-label="Thumbs up"
        >
          <span class="entypo--thumbs-up-empty"></span>
        </button>
        <button
          class="content-feedback__btn"
          @click="handleFeedback(false)"
          aria-label="Thumbs down"
        >
          <span class="entypo--thumbs-down-empty"></span>
        </button>
      </div>
    </template>

    <p v-else class="content-feedback__thanks mb-0">Thanks for your feedback!</p>
  </div>
</template>

<script setup>
import { ref } from "vue";

// ✅ Props
const props = defineProps({
  target: { type: Number, required: true },
  feedbackLeft: { type: Boolean, default: false },
  sectionKey: { type: String, default: null },
  reason: { type: String, default: null },
});

const emit = defineEmits(["feedback"]);

const hasLeftFeedback = ref(props.feedbackLeft);

async function handleFeedback(isPositive) {
  // Simulate API call for prototype
  await new Promise(resolve => setTimeout(resolve, 300));

  hasLeftFeedback.value = true;
  emit("feedback", {
    target: props.target,
    positive: isPositive,
    reason: props.reason,
    sectionKey: props.sectionKey,
  });
}
</script>