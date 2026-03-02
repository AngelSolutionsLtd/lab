<template>
    <div>
        <p class="d-none d-lg-block">Reduce screen size to see mobile menu</p>

        <div class="dashboard-mobile-nav d-block d-lg-none">
            <div class="row dashboard-mobile-nav__links">
                <a @click.prevent="menuOpen = true" class="pl-4"><span class="entypo--menu mr-1"></span>{{ menuText }}</a>
            </div>

            <div v-show="menuOpen" class="flyout-menu__bg"  @click.prevent="menuOpen = false"></div>
            <div :class="`${menuOpen ? 'is-open' : ''}`" class="flyout-menu">
                <div class="flyout-menu__header">
                    <h2>MENU</h2>
                    <button class="flyout-menu__close" @click.prevent="menuOpen = false">
                        <span class="entypo--cancel"></span>
                    </button>
                </div>
                <slot name="tabs"></slot>
            </div>
        </div>
    </div>
</template>

<script>
	export default {
		name: 'MobileNav',
		data() {
			return {
				menuOpen: false,
				menuText: 'Menu'
          	}
      	}
	}
</script>

<style lang="scss">
    .dashboard-mobile-nav {
        .flyout-menu {
            top: 0;
        }
    }
</style>