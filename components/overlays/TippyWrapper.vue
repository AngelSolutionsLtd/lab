<template>
  <Tippy
    ref="tippy"
    class="d-inline-block"
    :trigger="tippyOptions.trigger || 'click'"
    :maxWidth="tippyOptions.maxWidth || '1000px'"
    :placement="tippyOptions.placement || 'bottom'"
    theme="light"
    :interactive="tippyOptions.interactive ?? true"
    :zIndex="tippyOptions.zIndex || '9999'"
    :appendTo="appendTo"
    :popperOptions="popperOptions"
    @hide="$emit('hide')"
    @hidden="$emit('hidden')"
  >
    <template #content>
      <slot name="content"></slot>
    </template>

    <slot name="triggerTarget"></slot>
  </Tippy>
</template>

<script setup>
import { ref } from 'vue';
import { Tippy } from 'vue-tippy';
import 'tippy.js/dist/tippy.css';
import 'tippy.js/themes/light.css';
import 'tippy.js/themes/light-border.css';

const props = defineProps({
  tippyOptions: {
    type: Object,
    default: () => ({}),
  },
});

defineEmits(['hide', 'hidden']);

const tippy = ref(null);
const appendTo = () => (typeof document !== 'undefined' ? document.body : null);
const popperOptions = {
  modifiers: [
    {
      name: 'preventOverflow',
      options: {
        boundary: 'viewport',
      },
    },
  ],
};
</script>
