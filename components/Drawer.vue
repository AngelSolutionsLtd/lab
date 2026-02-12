<template>
	<transition :name="`${direction}-drawer`">
		<div
			class="side-drawer"
			:class="[isOpen ? `side-drawer--${direction}-open` : '', `side-drawer--${direction}`, {'has-side-btn': hasSideBtn, 'body-scroll-enabled': !scrollLocked, 'side-drawer--no-overlay': noOverlay}, wrapperPadding]"
			:style="alignTop ? 'top: 0 !important; height: 100vh !important;' : ''"
			ref="drawer-parent"
			v-if="isOpen || hasSideBtn"
		>
			<div
				class="side-drawer__inner"
				:class="{ 'side-drawer__inner-padding': isFixed }"
				ref="drawer-child"
			>
				<div
					v-if="hasHeader"
					class="side-drawer__header"
					:class="{ 'side-drawer__header-fixed': isFixed }"
				>
					<slot name="header"></slot>
				</div>
				<div ref="body">
					<slot></slot>

					<slot name="additionalContent"></slot>
				</div>

				<div
					v-if="hasFooter"
					class="side-drawer__footer"
					:class="{ 'side-drawer__footer-fixed': isFixed }"
				>
					<slot name="footer"></slot>
				</div>
			</div>
		</div>
	</transition>
</template>

<script>
import Scroll from "../Modules/Helpers/scroll";
export default {
    name: "DrawerComponent",
	props: {
		isOpen: {
			type: Boolean,
		},
		direction: {
			type: String,
			default: "right",
		},
		hasSideBtn: {
			type: Boolean,
			default: false
		},
		scrollLocked: {
			type: Boolean,
			default: true
		},
		wrapperPadding: {
			type: String,
			default: "py-5"
		},
		alignTop: {
			type: Boolean,
			default: false
		},
		noOverlay: {
			type: Boolean,
			default: false
		}
	},
	data() {
		return {
			scroll: new Scroll(),
			isFixed: false,
			observer: null
		};
	},
	computed: {
		hasHeader() {
			return !!this.$slots["header"];
		},
		hasFooter() {
			return !!this.$slots["footer"];
		}
	},
	methods: {
		stickyFooter() {
			if (this.hasFooter && this.isOpen) {
				if (
					this.$refs["drawer-child"].scrollHeight >=
					this.$refs["drawer-parent"].clientHeight - 30
				) {
					this.isFixed = true;
				} else {
					this.isFixed = false;
				}
			}
		},
		initObserver() {
			if (this.hasFooter && this.isOpen) {
				const config = {
					subtree: true,
					childList: true,
					threshold: 1.0
				}
				const callback = () => {
					this.$nextTick(() => {
						this.handleChildrenChanged()
					})
				}
				const observer = new MutationObserver(callback)
				observer.observe(this.$refs.body, config)
				this.observer = observer
			}
		},
		handleChildrenChanged() {
			this.stickyFooter();
		},			
	},
	watch: {
		isOpen(open) {
			if (open && this.scrollLocked) {
				this.scroll.disable();
				this.$nextTick(() => {
					this.initObserver()
					this.stickyFooter();
				});
			} else {
				this.scroll.enable();
			}
		},
		
	},
	mounted() {
		this.$nextTick(() => {
			window.addEventListener("resize", this.stickyFooter);
		});
	},
	beforeDestroy() {
		if (this.observer) this.observer.disconnect()
	},
	destroyed() {
		window.removeEventListener("resize", this.stickyFooter);
		this.scroll.enable();
	},
};
</script>

<style>
.side-drawer--no-overlay::before,
.side-drawer--no-overlay::after {
	display: none !important;
	content: none !important;
}
</style>
