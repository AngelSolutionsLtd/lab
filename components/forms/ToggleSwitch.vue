<template>
  <label class="switch">
    <input type="checkbox" v-model="inputVal" :checked="inputVal" ref="checkbox" />
    <span class="slider">{{value ? onText : offText}}</span>
  </label> 
</template>

<script>
  export default {
    name: "toggleSwitch",
    props: {
      value: {
        type: Boolean,
        default: false
      },
      onText: {
        type: String,
        default: 'ON'
      },
      offText: {
        type: String,
        default: 'OFF'
      },
      reset: {
        type: Number,
        default: 0
      }
    },
    computed: {
      inputVal: {
        get() {
          return this.value;
        },
        set(val) {
            this.$emit('input', val);
        }
      }
    },
    watch: {
      reset() {
        this.$refs['checkbox'].checked = this.value;
      }
    }
  }
</script>