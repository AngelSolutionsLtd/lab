<template>
  <div>
    <v-select
      v-model="selectedOption"
      :options="options"
      placeholder="Select an option"
    />
  </div>
</template>

<script>
import vSelect from 'vue-select';

export default {
  components: {
    vSelect,
  },
  props: {
    options: {
      type: Array,
      default: () => [],
    },
  },
  data() {
    return {
      selectedOption: null, // Initially selected option
    };
  },
};
</script>