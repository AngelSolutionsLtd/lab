<template>
  <div>
    <div v-if="readonly" class="status-dropdown status-dropdown--readonly">
      <div :class="`status-dropdown__selected status-dropdown__selected--${selectedValue?.classname}`">
        <span class="status-dropdown__circle"></span>
        {{ selectedValue?.label }}
      </div>
    </div>
    <v-select v-if="!readonly"
              :options="options"
              :clearable="false"
              v-model="selectedValue"
              @update:modelValue="setSelected"
              :searchable="false"
              class="status-dropdown">
      <template #selected-option="{ label, classname }">
        <div :class="`status-dropdown__selected status-dropdown__selected--${classname}`">
          <span class="status-dropdown__circle"></span>
          {{ label }}
        </div>
      </template>
      <template #option="{ classname, label }">
        <div :class="`status-dropdown__option status-dropdown__option--${classname}`">
          {{ label }}
          <span class="status-dropdown__circle"></span>
        </div>
      </template>
    </v-select>
  </div>
</template>

<script setup>
import { ref } from 'vue';
import vSelect from 'vue-select';

defineOptions({
  name: 'StatusDropdown',
})

const emit = defineEmits(["selectOption"]);

const props = defineProps({
	options: { type: Array, required: true },
    defaultValue: { type: Number, required: false },
    readonly: { type: Boolean, required: false },
});

const selectedValue = ref(props.options.find((x) => x.id === props.defaultValue) ?? props.options[0] ?? null);

const setSelected = (value) => {
    emit("selectOption", value);
};
</script>
