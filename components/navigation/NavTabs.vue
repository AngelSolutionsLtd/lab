<template>
	<ul class="nav nav--tabs"
		:class="{
			'nav--school': !isVertical,
			'nav--vtabs scroll-container mvh-80': isVertical,
            'has-min-width': !isVertical && setWidth
		}"
	>
		<li
			v-for="(link, index) in navList"
			:key="index"
			:class="isVertical ? 'nav--vtabs__item' : ''">
			<a
				href="#"
				@click.prevent="setRoute(link)"
				:itemid="index"
				:class="{
					'nav--tabs__selected-item': isActiveTab(link),
					'nav--vtabs--selected': isVertical && isActiveTab(link),
				}">

				<div v-if="isVertical" class="d-flex align-items-center">
					<p class="mb-0 force-break">{{ link.title }}</p>
					<template v-if="withOptions">
						<slot name="options" :item="link"></slot>
					</template>
				</div>

                <template v-else>
                    <span class="d-block d-lg-none d-xl-inline-block">
                        {{link.title}}
                    </span>
                    
                    <span class="d-none d-lg-inline-block d-xl-none">
                        {{link.responsiveName}}
                    </span>
                </template>

                <span v-if="link.hasNotification" class="nav--tabs__notification ml-2">3</span>
			</a>
		</li>
	</ul>
</template>

<script>
export default {
	name: "NavTabs",
	data() {
		return {
			activeTab: null,
		};
	},
	props: {
		navList: {
			type: Array,
		},
        isVertical: {
            type: Boolean,
            default: false,
        },
        setWidth: {
            type: Boolean,
            default: false
        },
		withOptions: {
			type: Boolean,
            default: false
		}

	},
	methods: {
		setRoute(link) {
			this.activeTab = link.title;
			this.$emit("setActiveRoute", link.title);
		},
		isActiveTab(link) {
			return this.activeTab === link.title;
		},
	},
	mounted() {
		if (this.navList.length > 0) {
			this.setRoute(this.navList[0]);
		}
	},
};
</script>