<template>
  <button
    @click.prevent="$emit('buttonClicked')"
    :disabled="disabled"
    class="btn--loader"
    :class="[buttonClass, { 'loading': loading, 'inactive': disabled }]"
  >
    <span v-if="icon && !loading" :class="[icon, 'mr-2']"></span>
    <svg
      v-else-if="loaderStyle === 'spinner' && loading"
      width="18"
      height="18"
      viewBox="0 0 24 24"
      xmlns="http://www.w3.org/2000/svg"
      class="mr-2 spinner-inline vertical-align-middle"
    >
      <path
        d="M10.14,1.16a11,11,0,0,0-9,8.92A1.59,1.59,0,0,0,2.46,12,1.52,1.52,0,0,0,4.11,10.7a8,8,0,0,1,6.66-6.61A1.42,1.42,0,0,0,12,2.69h0A1.57,1.57,0,0,0,10.14,1.16Z"
        fill="white"
        class="spinner-icon"
      />
    </svg>

    <span v-if="!loading || loaderStyle === 'spinner'">{{ buttonText }}</span>

    <div v-if="loaderStyle === 'dotted' && loading && !loadingText" class="loader-animation">
      <span class="1"></span>
      <span class="2"></span>
      <span class="3"></span>
      <span class="4"></span>
      <span class="5"></span>
    </div>

    <div
      v-if="loaderStyle === 'dotted' && loading && loadingText"
      class="d-flex align-items-center justify-content-center"
    >
      <svg
        width="24"
        height="24"
        viewBox="0 0 24 24"
        xmlns="http://www.w3.org/2000/svg"
        class="mr-2"
      >
        <path
          d="M10.14,1.16a11,11,0,0,0-9,8.92A1.59,1.59,0,0,0,2.46,12,1.52,1.52,0,0,0,4.11,10.7a8,8,0,0,1,6.66-6.61A1.42,1.42,0,0,0,12,2.69h0A1.57,1.57,0,0,0,10.14,1.16Z"
          fill="white"
          class="spinner-icon"
        />
      </svg>
      {{ loadingText }}
    </div>
  </button>
</template>

<script>
export default {
  name: 'LoadingButton',
  emits: ['buttonClicked'],
  props: {
    buttonText: { type: String, default: 'Submit' },
    buttonClass: { type: String, default: 'btn btn--primary' },
    icon: { type: String, default: '' },
    disabled: { type: Boolean, default: false },
    loading: { type: Boolean, default: false },
    loadingText: { type: String, default: '' },
    loaderStyle: {
      type: String,
      default: 'dotted',
      validator: v => ['dotted', 'spinner'].includes(v),
    },
  },
};
</script>

<style scoped>
@keyframes spin {
  to { transform: rotate(360deg); }
}

.spinner-icon {
  animation: spin 0.7s linear infinite;
  transform-origin: center;
  display: inline-block;
}

.spinner-inline {
  display: inline-block;
}

.vertical-align-middle {
  vertical-align: middle;
}
</style>
