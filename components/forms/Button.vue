<template>
  <button type="button" :class="classes" @click="onClick">{{ label }}</button>
</template>

<script>
// import './button.css';
import '../fonts/style.css';

export default {
  name: 'my-button',

  props: {
    label: {
      type: String,
      required: true,
    },
    size: {
      type: String,
      default: 'small',
      validator: function (value) {
        return ['small', 'large', 'huge', 'full'].indexOf(value) !== -1;
      },
    },
    btnColor: {
      type: String,
      default: 'primary',
      validator: function (value) {
        return ['primary','secondary','tertiary', 'quaternary', 'positive', 'negative'].indexOf(value) !== -1;
      },
    },
    inverted: {
      type: Boolean,
      default: false
    },
    // New prop for rounded corners
    roundedCorners: {
      type: Boolean,
      default: false
    }
  },

  computed: {
    classes() {
      return {
        'btn': true,
        [`btn--${this.size}`]: true,
        [`${this.btnColor !== 'primary' ? `btn--${this.btnColor}` : 'btn'}--inverted`]: this.inverted,
        [`${this.default}`]: true,
        'btn--rounded': this.roundedCorners  // Adds btn--rounded if roundedCorners is true
      };
    },
    default() {
      if (this.btnColor != 'primary' && !this.inverted) {
        return `btn--${this.btnColor}`
      } else {
        return ''
      }
    }
  },
  methods: {
    onClick() {
      this.$emit('onClick');
    },
  },
};
</script>
