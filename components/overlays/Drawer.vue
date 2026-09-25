<template>
	<div>
		<transition name="fade">
            <div
                v-if="props.isOpen && props.showOverlay"
                class="side-drawer__overlay"
            />
        </transition>

		<transition :name="`${direction}-drawer`">
			<div
				class="side-drawer"
				:class="[props.isOpen ? `side-drawer--${props.direction}-open` : '', `side-drawer--${props.direction}`, {'has-side-btn': props.hasSideBtn}, props.wrapperPadding, $attrs.class]"
				ref="drawer-parent"
				v-if="props.isOpen || props.hasSideBtn"
			>
				<div
					class="side-drawer__inner"
					:class="{ 'side-drawer__inner-padding': isFixed }"
					ref="drawer-child"
				>
					<div
						v-if="hasHeader"
						class="side-drawer__header"
						:class="{ 'side-drawer__header-fixed': isFixed || props.stickyHeader }"
					>
						<slot name="header"></slot>
					</div>
					<div ref="body" :class="[props.bodyClasses]">
						<slot></slot>

						<slot name="additionalContent"></slot>
					</div>

					<div
						v-if="hasFooter"
						class="side-drawer__footer"
						:class="{ 'side-drawer__footer-fixed': isFixed || props.hasStickyFooter }"
					>
						<slot name="footer"></slot>
					</div>
				</div>
			</div>
		</transition>
	</div>
</template>

<script setup>
import Scroll from "../../Modules/scroll";
import { ref, computed, nextTick, useSlots, watch, onMounted, onUnmounted, onBeforeUnmount, useTemplateRef } from 'vue'

defineOptions({
	name: 'DrawerComponent',
	inheritAttrs: false, // stop classes landing on the wrapper div
});

const props = defineProps({
	isOpen: { type: Boolean },
	direction: { type: String, default: 'right' },
	hasSideBtn: { type: Boolean, default: false },
	scrollLocked: { type: Boolean, default: true },
	wrapperPadding: { type: String, default: 'py-5' },
	bodyClasses: { type: [String, Object], required: false, default: '' },
	stickyHeader: { type: Boolean, default: false},
	hasStickyFooter: { type: Boolean, default: false},
	showOverlay: { type: Boolean, default: false},
});

const scroll = new Scroll();
const isFixed = ref(false);
let observer = null;

const slots = useSlots();

const hasHeader = computed(() => !!slots.header);
const hasFooter = computed(() => !!slots.footer);

const drawerChild = useTemplateRef('drawer-child')
const drawerParent = useTemplateRef('drawer-parent')
const body = useTemplateRef('body')

function stickyFooter() {
	if (hasFooter.value && props.isOpen) {
		if (
			drawerChild.value.scrollHeight >=
			drawerParent.value.clientHeight - 30
		) {
			isFixed.value = true;
		} else {
			isFixed.value = false;
		}
	}
}

function initObserver() {
	if (hasFooter.value && props.isOpen) {
		const config = {
			subtree: true,
			childList: true,
			threshold: 1.0
		}
		const callback = () => {
			nextTick(() => {
				handleChildrenChanged()
			})
		}
		observer = new MutationObserver(callback)
		observer.observe(body.value, config)
	}
}

function handleChildrenChanged() {
	stickyFooter();
}

watch(() => props.isOpen, (open) => {
	if (open && props.scrollLocked) {
		scroll.disable();
		nextTick(() => {
			initObserver()
			stickyFooter();
		});
	} else if (!open && props.scrollLocked) {
		scroll.enable();
	}
});

onMounted(() => {
	nextTick(() => {
		window.addEventListener("resize", stickyFooter);
	});
});

onBeforeUnmount(() => {
	if (observer) observer.disconnect()
});

onUnmounted(() => {
	window.removeEventListener("resize", stickyFooter)
	if (scroll.isDisabled) {
		scroll.enable();
	}
});
</script>
