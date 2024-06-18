<template>
    <label class="check-box" :class="{'check-box--complete ' : complete, 'check-box--small ' : small}">
      <input type="checkbox" v-model="isChecked"><span></span>
      <slot></slot>
    </label>
  </template>
  
  <script>
  export default {
    name: 'checkbox',
    props: {
      value: {
        type: Boolean,
        required: false,
        default: undefined
      },
      complete: {
        type: Boolean,
        required: false,
        default: false
      },
      small: {
        type: Boolean,
        required: false,
        default: false
      },
    },
    computed: {
      isChecked: {
        get() {
          return this.value;
        },
        set(value) {
          this.$emit('input', value);
        }
      }
    },
  }
  </script>