<template> 
  <div class="d-flex align-items-center">
    <input :id="id" class="mr-2" :class="radioClasses" type="radio" :value="value" v-model="selectedValue">
    <label :for="id">{{ label }}</label>
  </div>
</template>
  
  <script>
  export default {
    name: 'radio',
    props: {
        id: String,
        label: String,
        value: String,
        selectedValue: String,
        large: Boolean
    },
    computed: {
        radioClasses() {
            return {
                'form-accent-color--psp': true,
                'radio-large': this.large
            };
        }
    }
  }
  </script>