<template>
    <div class="checkbox-select" :class="{ isActive: activeTrigger }" v-click-outside="closeDropdown">
        <div class="checkbox-select__trigger" :class="{ isActive: activeTrigger }" @click="showDropdown">
            <span class="checkbox-select__title">
                <span>{{selectTitle}}</span>
            </span>
            <span class="checkbox-select__icon" :class="activeTrigger ? 'entypo--up-open' : 'entypo--down-open'"></span>
        </div>

        <div :id="`${selectedContextSingle}_dropdown`" class="checkbox-select__dropdown" :class="{ activeSearch: showLoader }">
            <div v-if="searchable" class="checkbox-select__search-wrapp">
                <span class="entypo--search"></span>
                <input type="text" @focus="showLoader = true" @blur="showLoader = false" :placeholder="`Search ${selectedContextPlural}...`" v-model="search">
                <button class="btn--default entypo--cancel p-0" @click.prevent="search = ''"></button>
            </div>
            <div v-if="showControls" class="checkbox-select__col">
                <div class="d-flex">
                    <div class="checkbox-select__select-all mr-2">
                        <label :for="`${selectedContextSingle}_selectAll`">{{selectAllText}}</label>
                        <input type="checkbox" :id="`${selectedContextSingle}_selectAll`" @click="selectAll" v-model="allSelected">
                    </div>
                    <button @click.prevent="clearSelected" class="btn--default checkbox-select__clear">CLEAR</button>
                </div>

                <div class="checkbox-select__info mt-2 mt-xl-0">{{checkedItems.length}} SELECTED</div>
            </div>
            <ul class="checkbox-select__filters-wrapp">
                <li v-for="(filter) in filteredList" :key="filter.Id">
                    <div class="checkbox-select__check-wrapp">
                        <input :id="`${uid}_${selectedContextSingle}_${filter.Id}`" class="conditions-check" v-model="checkedItems" :value="filter.Id" type="checkbox" :disabled="anyOptionSelected(filter.Id)">
                        <label :for="`${uid}_${selectedContextSingle}_${filter.Id}`">{{filter.Name}}</label>
                    </div>
                </li>
                <li v-if="filteredList.length === 0 && search" class="text--center">
                    <div>Sorry, no matching {{selectedContextPlural}}</div>
                </li>
            </ul>
        </div>
    </div>
</template>

<script setup>
import { ref, computed, watch, onMounted, useId } from 'vue';
import ClickOutside from 'click-outside-vue3'

defineOptions({ name: 'CheckboxDropdown' })

const emit = defineEmits(['update:modelValue', 'update:anyOptionValue'])

const props = defineProps({
    options: { type: Array, required: true },
    selectedContextSingle: { type: String, required: true },
    selectedContextPlural: { type: String, required: true },
    selectedContextAll: { type: String, required: false, default: 'neutral' },
    useAnyItemOption: { type: Boolean, required: false, default: false },
    anyOptionValue: { type: Number, required: false, default: 0 },
    searchable: { type: Boolean, required: false, default: true },
    showControls: { type: Boolean, required: false, default: true },
    modelValue: { type: Array, required: true },
})

const vClickOutside = ClickOutside.directive

const uid = useId();

const search = ref('');
const allSelected = ref(false);
const selectAllText = 'Select All';
const activeTrigger = ref(false);
const dropdown = ref(false);
const showLoader = ref(false);

const checkedItems = computed({
  get() {
    return props.modelValue
  },
  set(val) {
    emit('update:modelValue', val)
  },
})

const filteredList = computed(() => {
  return props.options.filter((item) =>
    item.Name.toLowerCase().includes(search.value.toLowerCase())
  )
})

const anyOptionName = computed(() => {
    if (!props.useAnyItemOption) return '';
    return props.options.filter(x => x.Id === props.anyOptionValue).map(x => x.Name)[0];
})

const selectTitle = computed(() => {
    if (!checkedItems.value || checkedItems.value.length === 0)
        return `Select ${props.selectedContextPlural}`;
    else if (checkedItems.value.length === props.options.length) {
        return props.selectedContextAll;
    } else if (checkedItems.value.length > 0) {
        if (checkedItems.value.length === 1) {
            if (props.useAnyItemOption && checkedItems.value[0] === props.anyOptionValue)
                return anyOptionName.value;
            else
                return `1 ${props.selectedContextSingle} selected`;
        } else {
            return `${checkedItems.value.length} ${props.selectedContextPlural} selected`;
        }
    }
})

const localAnyOptionValue = computed({
  get() {
    return props.anyOptionValue
  },
  set(val) {
    emit('update:anyOptionValue', val)
  },
})

watch(checkedItems, (currentValue) => {
    if (props.useAnyItemOption) {
        if (currentValue.includes(props.anyOptionValue) && checkedItems.value.length > 1 && currentValue.indexOf(props.anyOptionValue) !== 0)
            checkedItems.value = [props.anyOptionValue];

        if (currentValue.includes(props.anyOptionValue) && checkedItems.value.length > 1 && currentValue.indexOf(props.anyOptionValue) === 0) {
            checkedItems.value.splice(0, 1);
        }

        if (checkedItems.value.length === 0)
            checkedItems.value = [props.anyOptionValue];
    }
})

function selectAll () {
    clearSelected();
    var items = []
    props.options.forEach(item => {
        if (props.useAnyItemOption && item.Id === props.anyOptionValue) return;

        items.push(item.Id);
    });
    checkedItems.value = items;
}

function clearSelected() {
    checkedItems.value = [];
}

function showDropdown() {
    if (dropdown.value == false) {
        dropdown.value = true;
        activeTrigger.value = true;
    } else {
        dropdown.value = false;
        activeTrigger.value = false;
    }
}

function closeDropdown() {
    dropdown.value = false;
    activeTrigger.value = false;
    search.value = "";
}

function anyOptionSelected(filterId) {
    return (props.useAnyItemOption && checkedItems.value.length === 1 && (checkedItems.value[0] === props.anyOptionValue && filterId === props.anyOptionValue));
}

onMounted(() => {
    if (props.useAnyItemOption) {
        checkedItems.value = [props.anyOptionValue]
    } else {
        checkedItems.value = props.modelValue
        localAnyOptionValue.value = 0
    }
})

</script>
