<template>
    <div>
        <div v-if="readonly"
             :class="['rag-dropdown rag-dropdown--readonly', {
        'rag-dropdown--condensed': condensed,
        'rag-dropdown--fullWidth': fullWidth
      }]">
            <div :class="`rag-dropdown__selected rag-dropdown__selected--${selectedValue?.classname || ''}`">
                <span class="rag-dropdown__circle"></span>
                {{ condensed ? selectedValue?.initial || '' : selectedValue?.label || '' }}
            </div>
        </div>
        <v-select v-if="!readonly"
                  v-model="selectedValue"
                  :options="options"
                  :clearable="false"
                  :searchable="false"
                  @update:modelValue="setSelected"
                  @search:focus="dropdownOpen"
                  @search:blur="dropdownClosed"
                  :class="['rag-dropdown', { 'rag-dropdown--condensed': condensed, 'rag-dropdown--fullWidth': fullWidth }]">
            <template #selected-option="{ classname, label, initial }">
                <div :class="`rag-dropdown__selected rag-dropdown__selected--${classname}`">
                    <span class="rag-dropdown__circle"></span>
                    {{ condensed ? initial : label }}
                </div>
            </template>
            <template #option="{ classname, label }">
                <div :class="`rag-dropdown__option rag-dropdown__option--${classname}`">
                    <span class="rag-dropdown__circle"></span>
                    {{ label }}
                </div>
            </template>
        </v-select>
    </div>
</template>

<script setup>
import { ref, watch } from 'vue';
import vSelect from 'vue-select';

defineOptions({
    name: 'RagDropdown',
})

const emit = defineEmits(["selectOption"]);

const props = defineProps({
	options: { type: Array, required: true },
    condensed: { type: Boolean, required: false, default: false },
    fullWidth: { type: Boolean, required: false, default: false  },
    defaultValue: { type: [Number, String], required: false },
    readonly: { type: Boolean, required: false },
});

const isOpen = ref(false)
const selectedValue = ref(null)

const setSelected = (value) => {
    emit("selectOption", value);
};

if (props.defaultValue) {
    selectedValue.value = props.options.find((x) => x.id === props.defaultValue)
} else {
    selectedValue.value = props.options.find((x) => x.initial === 'N')
}

const dropdownOpen = () => {
    isOpen.value = true;
}

const dropdownClosed = () => {
    isOpen.value = false;
}

watch(() => props.defaultValue, (newVal) => {
    if (newVal) {
        selectedValue.value = props.options.find((x) => x.id === newVal);
    }
});

</script>
