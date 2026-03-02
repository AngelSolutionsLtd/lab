<template>
  <div class="range-slider">
    <div class="range-slider__header">
      <span class="range-slider__label">{{ label }}</span>
      <span class="range-slider__value">{{ modelValue }}{{ unit }}</span>
    </div>
    <div class="range-slider__track-row">
      <span class="range-slider__bound">{{ min }}{{ unit }}</span>
      <div class="range-slider__track-wrap">
        <div v-if="showGradient" class="range-slider__track-bg range-slider__track-bg--gradient"></div>
        <div v-else class="range-slider__track-bg"></div>
        <input
          class="range-slider__input"
          type="range"
          :min="min"
          :max="max"
          :value="modelValue"
          @input="$emit('update:modelValue', Number($event.target.value))"
        />
      </div>
      <span class="range-slider__bound">{{ max }}{{ unit }}</span>
    </div>
  </div>
</template>

<script setup>
defineProps({
  modelValue: { type: Number, default: 50 },
  min: { type: Number, default: 0 },
  max: { type: Number, default: 100 },
  label: { type: String, default: 'Set Threshold' },
  unit: { type: String, default: '%' },
  showGradient: { type: Boolean, default: true }
})

defineEmits(['update:modelValue'])
</script>

<style scoped>
.range-slider {
  display: flex;
  flex-direction: column;
  gap: 8px;
  width: 100%;
  font-family: inherit;
}

.range-slider__header {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.range-slider__label {
  font-weight: 600;
  font-size: 14px;
  color: #333;
}

.range-slider__value {
  font-weight: 700;
  font-size: 14px;
  color: #7b2d8b;
}

.range-slider__track-row {
  display: flex;
  align-items: center;
  gap: 8px;
}

.range-slider__bound {
  font-size: 11px;
  color: #888;
  white-space: nowrap;
  min-width: 24px;
  text-align: center;
}

.range-slider__track-wrap {
  position: relative;
  flex: 1;
  height: 12px;
}

/* Gradient / plain visual track */
.range-slider__track-bg {
  position: absolute;
  inset: 0;
  border-radius: 99px;
  background: #ddd;
  pointer-events: none;
}

.range-slider__track-bg--gradient {
  background: linear-gradient(to right, #c0392b, #e67e22, #f1c40f, #27ae60);
}

/* The native <input type="range"> sits on top, filling the same space */
.range-slider__input {
  -webkit-appearance: none;
  appearance: none;
  position: absolute;
  top: 50%;
  left: 0;
  right: 0;
  width: 100%;
  transform: translateY(-50%);
  margin: 0;
  padding: 0;
  height: 12px;
  background: transparent;
  cursor: pointer;
  z-index: 1;
  outline: none;
  border: none;
}

/* Transparent track — visual track is the div behind */
.range-slider__input::-webkit-slider-runnable-track {
  background: transparent;
  height: 12px;
  border-radius: 99px;
}

.range-slider__input::-moz-range-track {
  background: transparent;
  height: 12px;
  border-radius: 99px;
}

/* Thumb — circle with white fill and purple border */
.range-slider__input::-webkit-slider-thumb {
  -webkit-appearance: none;
  appearance: none;
  width: 24px;
  height: 24px;
  border-radius: 50%;
  background: white;
  border: 2px solid #7b2d8b;
  box-shadow: 0 1px 4px rgba(0, 0, 0, 0.2);
  cursor: pointer;
  margin-top: -6px;
  transition: box-shadow 0.15s ease;
}

.range-slider__input::-webkit-slider-thumb:hover {
  box-shadow: 0 0 0 4px rgba(123, 45, 139, 0.15);
}

.range-slider__input::-moz-range-thumb {
  width: 24px;
  height: 24px;
  border-radius: 50%;
  background: white;
  border: 2px solid #7b2d8b;
  box-shadow: 0 1px 4px rgba(0, 0, 0, 0.2);
  cursor: pointer;
  transition: box-shadow 0.15s ease;
}

.range-slider__input::-moz-range-thumb:hover {
  box-shadow: 0 0 0 4px rgba(123, 45, 139, 0.15);
}

.range-slider__input:focus::-webkit-slider-thumb {
  box-shadow: 0 0 0 4px rgba(123, 45, 139, 0.2);
}

.range-slider__input:focus::-moz-range-thumb {
  box-shadow: 0 0 0 4px rgba(123, 45, 139, 0.2);
}
</style>
