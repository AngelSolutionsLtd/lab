<template>
  <div>
    <label :for="id" class="mb-1 size--14">{{ labelTitle }}:</label>
    <input :id="id" :placeholder="placeholder" class="d-block zeta text-input p-1" />
  </div>
</template>

<script setup>
import { defineProps } from 'vue';

const props = defineProps({
  id: String,
  placeholder: String,
  labelTitle: String
});
</script>