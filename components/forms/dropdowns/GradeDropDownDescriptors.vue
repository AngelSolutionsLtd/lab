<template>
	<div class="grade-dropdown" :class="{ 'grade-dropdown--large': !isMobile, 'grade-dropdown--reverse': props.gradesReverse }" ref="gradeDropdownEl">
		<div>
			<button 
				v-for="option in props.options"
				:key="option.publicId"
				:class="optionClass(option)"
				@click="setSelected(option)"
				@mouseover="setHighlighted(option)">
				<span :class="`grade-option__circle ${highlightedValue?.name == option.name ? 'highlighted' : '' }`"></span>
				{{ option.name }}
			</button>

			<template v-if="isMobile && props.showMessage">
				<p v-if="lastUpdatedMsg" class="mb-0 italic size--14" v-html="lastUpdatedMsg"></p>
				<p v-else class="mb-0 italic size--14">This KPI has <strong>never been set</strong></p>
			</template>
		</div>

		<template v-if="!isMobile || (isTouch && !isMobile)">
			<div :class="`grade-descriptor grade-descriptor--${highlightedValue?.cssClass}`">
				<div class="grade-descriptor__copy">
					<template v-if="highlightedValue?.descriptor && highlightedValue?.descriptor.text.trim().length">
						{{ highlightedValue?.descriptor.text }}
					</template>
					<template v-else>
						<span class="italic">No descriptor.</span>
					</template>
				</div>

				<div class="grade-descriptor__action text-right" v-if="props.showMessage || props.showInfoBtn">
					<button v-if="props.showInfoBtn && showSaveToday && props.showMessage" @click.prevent="showInfo" class="btn btn--secondary--inverted mb-2">
						<i class="entypo--doc-text"></i>
						More Info
					</button>

					<template v-if="props.showMessage">
						<button v-if="showSaveToday && props.updatedAt != null" @click.prevent="setSelected(selectedValue)" class="btn btn--positive--inverted mb-2 ml-3">
								<i class="entypo--pencil" />
								Save KPI as of today
						</button>
						<p v-if="lastUpdatedMsg" class="mb-0 italic text-right" v-html="lastUpdatedMsg"></p>
						<p v-else class="mb-0 italic text-right">This KPI has <strong>never been set</strong></p>
					</template>
				</div>
			</div>
		</template>
	</div>
</template>

<script setup>
	import { ref, computed, onMounted, onUpdated, onUnmounted } from 'vue';
	import moment from 'moment';

	const props = defineProps({
		options: {
			type: Array,
			required: true,
		},
		value: {
			required: false
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
		}
	});

	const emit = defineEmits(['setSelected', 'info-btn-clicked']);

	const highlightedValue = ref(
		props.options.find((x) => x.publicId === props.value) || {
			publicId: null,
			name: '',
			descriptor: null,
			cssClass: 'default'
		}
	);

	const gradeDropdownEl = ref(null);
	const isMobile = ref(false);

	const isTouch = computed(() => {
		return document.lastChild.classList.contains('mdzr--touch');
	});

	const lastUpdatedMsg = computed(() => {
		if (!props.updatedAt) return null;

		if (props.updatedBy) {
			return `Last updated by <strong>${props.updatedBy}</strong> on <strong>${moment(props.updatedAt).format("DD/MM/YY")}</strong> at <strong>${moment(props.updatedAt).format("HH:mm")}</strong>`;
		}

		return `Last updated on <strong>${moment(props.updatedAt).format("DD/MM/YY")}</strong> at <strong>${moment(props.updatedAt).format("HH:mm")}</strong>`;
	});

	const selectedValue = computed(() => {
		return props.options.find(x => x.publicId === props.value);
	});

	const showSaveToday = computed(() => {
		return props.value === highlightedValue.value?.publicId;
	});

	const onResize = () => {
		isMobile.value = window.innerWidth <= 992;
	};

	const optionClass = (option) => {
		let optionClass = "grade-option ";

		if (selectedValue.value && selectedValue.value.publicId === option.publicId) {
			optionClass += `grade-option--selected grade-option--selected--${selectedValue.value.cssClass}`;
		} else {
			optionClass += `grade-option--${option.cssClass}`;
		}

		return optionClass;
	};

	const setHighlighted = (value) => {
		highlightedValue.value = (value ?? props.options.find((x) => x.publicId === props.value)) || {
			publicId: null,
			name: '',
			descriptor: null,
			cssClass: 'default'
		};
	};

	const setSelected = (value) => {
		emit('setSelected', value);
	};

	const showInfo = () => {
		emit('info-btn-clicked');
	};

	defineExpose({ resetHighlighted: () => setHighlighted(null) });

	const updateHeight = () => {
		requestAnimationFrame(() => {
			if (gradeDropdownEl.value && gradeDropdownEl.value.offsetHeight > 0) {
				gradeDropdownEl.value.style.height = gradeDropdownEl.value.offsetHeight + 'px';
			}
		});
	};

	onMounted(() => {
		window.addEventListener("resize", onResize);
		onResize();
		updateHeight();
	});

	onUpdated(() => {
		onResize();
		updateHeight();
	});

	onUnmounted(() => {
		window.removeEventListener("resize", onResize);
	});
    
</script>
