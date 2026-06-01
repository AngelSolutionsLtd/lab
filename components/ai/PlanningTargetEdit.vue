<template>
  <div class="planning-target-edit form-fields text--left">
    <div class="form-group mb-4">
      <label class="form-label">Title</label>
      <input
        type="text"
        class="form-control"
        :class="{ 'is-invalid': !hasValidTitle }"
        v-model="localTarget.title"
        placeholder="Target title…"
        @input="emit('update:modelValue', { ...localTarget })"
      />
      <span v-if="!hasValidTitle" class="invalid-feedback">A title is required.</span>
    </div>

    <div class="form-group mb-4">
      <label class="form-label">Description</label>
      <textarea
        class="form-control"
        rows="4"
        v-model="localTarget.description"
        placeholder="Describe this target…"
        @input="emit('update:modelValue', { ...localTarget })"
      ></textarea>
    </div>

    <div class="form-group mb-4">
      <label class="form-label">Strategy</label>
      <textarea
        class="form-control"
        rows="4"
        v-model="localTarget.strategy"
        placeholder="Outline the strategy…"
        @input="emit('update:modelValue', { ...localTarget })"
      ></textarea>
    </div>

    <TildaApiErrorView v-if="apiErrorType" :error-type="apiErrorType" />
  </div>
</template>

<script setup>
import { ref, computed, watch } from 'vue';
import TildaApiErrorView from './shared/tilda-api-error-view.vue';

const props = defineProps({
  modelValue: { type: Object, default: () => ({}) },
  target: { type: Object, default: null },
  generatedSCActions: { type: Boolean, default: false },
});

const emit = defineEmits(['update:modelValue', 'height-changed', 'save']);

const localTarget = ref({ title: '', description: '', strategy: '', ...props.modelValue });
const apiErrorType = ref('');
const isGenerating = ref(false);
const addTargetStep = ref(false);

watch(() => props.modelValue, (val) => {
  localTarget.value = { ...val };
}, { deep: true });

const hasValidTitle = computed(() => localTarget.value.title?.trim().length > 0);

async function onContinue() {
  if (!hasValidTitle.value) return;

  if (props.generatedSCActions) {
    isGenerating.value = true;
    apiErrorType.value = '';
    try {
      // Mocked — replace with real action in production
      await new Promise(resolve => setTimeout(resolve, 1500));
      addTargetStep.value = true;
    } catch (err) {
      apiErrorType.value = 'UNKNOWN_ERROR';
    } finally {
      isGenerating.value = false;
    }
  } else {
    addTargetStep.value = true;
  }
}

function saveTarget() {
  emit('save', { ...localTarget.value });
}

defineExpose({ hasValidTitle, isGenerating, apiErrorType, addTargetStep, onContinue, saveTarget });
</script>

<style scoped>
.form-label {
  display: block;
  font-size: 0.9375rem;
  font-weight: 500;
  color: #333;
  margin-bottom: 0.375rem;
}

.form-control {
  width: 100%;
  padding: 0.5rem 0.75rem;
  font-family: inherit;
  font-size: 1rem;
  border: 1px solid #ddd;
  border-radius: 6px;
  box-sizing: border-box;
  transition: border-color 0.2s ease;
}

.form-control:focus {
  outline: none;
  border-color: #8b5cf6;
  box-shadow: 0 0 0 2px rgba(139, 92, 246, 0.1);
}

.form-control.is-invalid {
  border-color: #dc2626;
}

.invalid-feedback {
  display: block;
  font-size: 0.8125rem;
  color: #dc2626;
  margin-top: 0.25rem;
}

textarea.form-control {
  resize: vertical;
}
</style>
