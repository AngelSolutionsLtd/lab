<template>
    <div class="breadcrumb-nav">
        <h3 class="caps my-2">
            <a @click.prevent="navigateToRoot" :class="LINK_CLASS">
                <span class="d-none d-xl-inline-block underline">Performance Management</span>
                <span class="d-xl-none underline">Perf Management</span>
            </a>
            <template v-if="showSubdirectory">
                <span :class="SEPARATOR_CLASS">/</span>
                <router-link v-if="showPage" :class="LINK_CLASS">
                    {{ breadcrumb.subdirectory }}
                </router-link>
            </template>
            <span v-if="showPage" :class="SEPARATOR_CLASS">/</span>

            <Tippy interactive
                   placement="bottom"
                   theme="light"
                   trigger="click"
                   maxWidth="380px"
                   :appendTo="appendToBody"
                   ref="tippyWrapper"
                   @state="({ isVisible }) => isMenuOpen = isVisible">
                <a :class="LINK_CLASS" @click.prevent>
                    <strong>{{ activeLabel }}<span :class="`nmr-1 entypo--${ isMenuOpen ? 'up' : 'down' }-open`" /></strong>
                </a>

                <template #content >
                    <div class="options-tooltip">
                        <div class="pl-0 pr-0" v-for="item in modules" :key="item.id">
                            <a v-if="item.isUrl" :href="item.link" class="options-tooltip__link p-2">
                                <strong>{{ $filters.terminology(item.title) }}</strong>
                            </a>
                            <router-link v-else :to="{ name: item.routeName }" class="options-tooltip__link p-2">
                                <strong>{{ $filters.terminology(item.title) }}</strong>
                            </router-link>
                        </div>
                    </div>
                </template>
            </Tippy>
        </h3>
    </div>
</template>

<script setup>
    import { ref, computed } from 'vue';
    import { useRouter, useRoute } from 'vue-router';
    import { Tippy } from 'vue-tippy';

    const getBreadcrumbs = (matchedRoutes) => { 
    return matchedRoutes.reduce(
        (acc, route) => !!route.meta?.breadcrumb 
            ? { ...acc, ...route.meta.breadcrumb }
            : acc,
        {})
    };

    const router = useRouter();
    const route = useRoute();

    const PATH_CLASS = 'caps d-inline-block';
    const LINK_CLASS = `${PATH_CLASS} underline weight--normal`;
    const SEPARATOR_CLASS = 'brand--secondary-l30 weight--light mx-1';

    const isMenuOpen = ref(false);
    const tippyWrapper = ref(null);
    const breadcrumb = computed(() => getBreadcrumbs(route.matched));
    const showSubdirectory = computed(() => !!breadcrumb.value?.subdirectory?.length);
    const showPage = computed(() => showSubdirectory.value && !!breadcrumb.value?.page?.length);
    const activeLabel = computed(() => breadcrumb.value?.page || breadcrumb.value?.subdirectory);

    const navigateToRoot = () => router.push('/');

    const appendToBody = () => document.body;

    const routeData = [
        { id: 1, title: 'Analysis', routeName: 'Analysis' },
        { id: 2, title: 'Development Feedback', routeName: 'DevelopmentFeedback'}
    ];

    const modules = computed(() => {
    return routeData.filter(item =>
        item.title !== activeLabel.value &&
        (!item.canAccess || item.canAccess(permissions.value))
    );
});

</script>
