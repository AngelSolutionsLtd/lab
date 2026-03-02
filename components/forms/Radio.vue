<template>
  <div class="d-flex align-items-center">
    <input
      :id="id"
      class="mr-2"
      :class="radioClasses"
      type="radio"
      :value="value"
      :checked="modelValue === value"
      @change="$emit('update:modelValue', value)"
    />
    <label :for="id">{{ label }}</label>
  </div>
</template>

<script setup>
import { computed } from 'vue';

const props = defineProps({
  id: String,
  label: String,
  value: String,
  modelValue: String,
  large: Boolean,
});

const emit = defineEmits(['update:modelValue']);

const radioClasses = computed(() => ({
  'form-accent-color--psp': true,
  'radio-large': props.large,
}));
</script>
