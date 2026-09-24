<template>
	<div class="search-box">
		<input type="text" :placeholder="placeholder" v-model.trim="searchTerm" @keydown.enter="$emit('onEnter')">
		<button v-if="modelValue && modelValue.length" @click.prevent="clear" aria-label="Clear search" class="search-box__delete btn--default entypo--cancel"></button>
	</div>
</template>

<script setup>
import { computed } from 'vue';

const props = defineProps({
    modelValue: {
        type: String,
        default: null
    },
    placeholder: {
        type: String,
        default: 'Search...'
    }
});

const emit = defineEmits(['update:modelValue', 'onClear', 'onEnter']);

const searchTerm = computed({
  get() {
    return props.modelValue;
  },
  set(value) {
    emit('update:modelValue', value);
  }
})

function clear() {
  emit('update:modelValue', '')
  emit('onClear')
}
</script>
