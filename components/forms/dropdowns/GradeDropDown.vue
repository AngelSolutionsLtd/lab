<template>
	<div>
		<!-- using tippy wrapper -->

		<template v-if="!readOnly">
			<TippyWrapper :tippyOptions="{zIndex: '999999', placement: 'bottom-start'}" @hide="closeDropdown" @hidden="onDropdownHidden" ref="childComponent">
				<template #triggerTarget>
					<button :class="`grade-dropdown__selected grade-dropdown__selected--${selectedValue ? selectedValue.cssClass : ''}`"
					@click.prevent="toggleDropdown">
						<span class="grade-dropdown__circle"></span>
						{{ selectedValue ? selectedValue.key : '' }}
						<span v-if="!isOpen" class="grade-dropdown__arrow entypo--down-open"></span>
						<span v-else class="grade-dropdown__arrow entypo--up-open"></span>
					</button>
				</template>

				<template #content>
					<GradeDropDownDescriptors
					ref="descriptors"
					:options="props.options"
					:value="props.modelValue"
					:updatedBy="props.updatedBy"
					:updatedAt="props.updatedAt"
					:showMessage="props.showMessage"
					:gradesReverse="props.gradesReverse"
					:showInfoBtn="props.showInfoBtn"
					@setSelected="setSelected"
					@info-btn-clicked="infoBtnClicked"/>
				</template>

			</TippyWrapper>
		</template>

		<template v-else>
			<TippyWrapper :tippyOptions="{trigger: 'mouseenter', theme:'light wrapper-no-padding', zIndex: '999999'}" @hide="closeDropdown" @hidden="onDropdownHidden" ref="childComponent">
				<template #triggerTarget>
					<div 
						class="grade-read-only cursor--pointer" 
						:class="`grade-read-only--${selectedValue?.cssClass}`">
						<div class="grade-read-only__value">
							<span class="grade-read-only__circle"></span>
							{{ selectedValue ? selectedValue.key : '' }}
						</div>
					</div>
				</template>

				<template #content>
					<div class="vue-tooltip" :class="`vue-tooltip--${selectedValue ? selectedValue?.cssClass : ''}`">
						<p class="mb-0 size--14 text-left vue-tooltip__text is-larger mb-1"><strong>{{ selectedValue ? selectedValue?.name : '' }}</strong></p>

						<template v-if="descriptorText">
							<hr class="rule my-1" />
							<p>{{ descriptorText }}</p>
						</template>
						
						<template v-if="showMessage">
							<p v-if="lastUpdatedMsg" class="mb-0 size--14 text-left italic mb-3" v-html="lastUpdatedMsg"></p>
							<p v-else class="mb-0 size--14 text-left italic mb-3">This KPI has <strong>never been set</strong></p>
						</template>
					</div>
				</template>
			</TippyWrapper>
		</template>
	</div>
</template>

<script setup>
	import { computed, ref } from 'vue';
	import GradeDropDownDescriptors from './GradeDropDownDescriptors';
    import TippyWrapper from '../../overlays/TippyWrapper.vue';
    import moment from 'moment';

	const props = defineProps({
		options: {
			type: Array,
			required: true,
		},
		modelValue: {
			type: [String, Object],
			required: false
		},
		readOnly: {
			type: Boolean,
			default: false
		},
		updatedBy: {
			type: String,
			required: false
		},
		updatedAt: {
			type: String,
			required: false
		},
		showMessage: {
			type: Boolean,
			default: false
		},
		gradesReverse: {
			type: Boolean,
			default: false
		},
		showInfoBtn: {
			type: Boolean,
			default: false
		},
		isPreview: {
			type: Boolean,
			default: false,
			required: false
		},
		showGradeDescriptors: {
			type: Boolean,
			default: false
		}
	});

	// Define emits
	const emit = defineEmits(['update:modelValue', 'info-btn-clicked']);

	// Reactive state
	const highlightedValue = ref(props.options.find((x) => x.publicId === props.modelValue));
	const isOpen = ref(false);

	// Reactive variables for refs
	const childComponent = ref(null)
	const descriptors = ref(null)

	// Computed properties

    const selectedEndDate = ref(new Date());

	const selectedValue = computed(() => props.options.find((x) => x.publicId === props.modelValue));
	
	const isTouch = computed(() => document.lastChild.classList.contains('mdzr--touch'));
	
	const isToday = computed(() => {
	
		const today = new Date();
	
		const selectedDate = new Date(selectedEndDate.value);
		return (
			selectedDate.getFullYear() === today.getFullYear() &&
			selectedDate.getMonth() === today.getMonth() &&
			selectedDate.getDate() === today.getDate()
		);
	});

	const lastUpdatedMsg = computed(() => {
		if (!props.updatedAt) return null;

		const todayMsg = isToday.value ? "Last updated" : "Set";
		const formattedDate = moment(props.updatedAt).format("DD/MM/YY");
		const formattedTime = moment(props.updatedAt).format("HH:mm");

		if (props.updatedBy) {
			return `${todayMsg} by <strong>${props.updatedBy}</strong> on <strong>${formattedDate}</strong> at <strong>${formattedTime}</strong>`;
		} else {
			return `${todayMsg} on <strong>${formattedDate}</strong> at <strong>${formattedTime}</strong>`;
		}
	});

  const descriptorText = computed(() => props.showGradeDescriptors ? selectedValue.value?.descriptor?.text : null);

	// Methods

	const toggleDropdown = () => {
		isOpen.value = !isOpen.value;
	};

	const closeDropdown = () => {
		isOpen.value = false;
	};

	const setHighlighted = (value) => {
		highlightedValue.value = value ?? props.options.find((x) => x.publicId === props.modelValue);
	};

	const onDropdownHidden = () => {
		setHighlighted(null);
		descriptors.value?.resetHighlighted();
	};

	const setSelected = (value) => {
		if (props.isPreview) return;
		const tippyRef = childComponent.value.$refs.tippy;
		if (isTouch.value) {
			if (highlightedValue.value && value.name === highlightedValue.value.name) {
				emit('update:modelValue', value);
				if (tippyRef) {
					tippyRef.hide();
				}
			} else {
				setHighlighted(value);
			}
		} else {
			if (tippyRef) {
				tippyRef.hide();
			}
			emit('update:modelValue', value);
		}
	};

	const infoBtnClicked = () => {
		emit('info-btn-clicked');
		const tippyRef = childComponent.value.$refs.tippy;
		if (tippyRef) {
			tippyRef.hide();
		}
	};

</script>