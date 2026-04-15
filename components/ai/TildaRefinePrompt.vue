<template>
    <div>
        <div class="tilda-refine-popup">
          <div class="tilda-refine-popup__header mb-2">
            <p class="pb-0 mb-0">Give TILDA some guidance on how to refine this text.</p>
            <span class="entypo--cancel-circled" @click.prevent="close"
            />
          </div>
          <div class="d-flex">
            <textarea
              ref="inputEl"
              v-model="modelValueLocal"
              rows="4"
              placeholder="Make it longer, make it shorter, simplify, change tone..."
              :disabled="loading"
              @keydown.ctrl.enter.prevent="onRefine"
              @keydown.meta.enter.prevent="onRefine"
              class="w-100"
            ></textarea>
        
            <button
              aria-label="Refine"
              type="button"
              title="Refine"
              tabindex="-1"
              class="btn btn--tilda btn--tilda--icon ml-2"
              :disabled="!isValidInput || loading"
              :aria-disabled="!isValidInput || loading"
              @click.prevent="onRefine"
            >
              <span
                :class="[
                  loading ? 'entypo--cog spin' : 'entypo--twinkle',
                  'd-flex align-items-center justify-content-center'
                ]"
              ></span>
            </button>
          </div>

          <div class="tilda-refine-popup-messages mt-2">
              <TildaApiErrorView v-if="error" :error-type="error" />
          </div>
      
        </div>

    </div>
</template>

<script setup>
import { defineEmits, ref, watch, computed, onMounted, nextTick  } from 'vue'
import TildaApiErrorView from './shared/tilda-api-error-view.vue'

const props = defineProps({
  modelValue: String,
  close: Boolean,
  loading: Boolean,
  error: String,
  warning: String,
  sectionLabel: String
})

const emit = defineEmits([
  'update:modelValue',
  'close',
  'refine',
  'cancel-warning',
  'confirm-warning'
])

const modelValueLocal = ref(props.modelValue)

watch(() => props.modelValue, val => {
  modelValueLocal.value = val
})
watch(modelValueLocal, val => {
  emit('update:modelValue', val)
})

const isValidInput = computed(() => {
  return modelValueLocal.value?.trim().length >= 3
})

const onRefine = () => {
  if (isValidInput.value && !props.loading && !props.warning) {
    // Emit the refine request but do not clear the textarea here.
    // The parent (`tilda-refine-modal.vue`) controls `refineAdjust`/loading
    // and will clear the value when the refine operation completes.
    emit('refine', modelValueLocal.value)
  }
}
const close = () => {
  emit('close')
  emit('update:modelValue', '')
  modelValueLocal.value = ''
}

const inputEl = ref(null)

// Autofocus once visible
onMounted(() => {
  setTimeout(() => inputEl.value?.focus(), 200) // matches your transition duration
})

</script>