<template>
    <div class="status-accordion" :class="{ 'is-expanded': isOpen }">
        <button
            :id="headerId"
            type="button"
            class="status-header status-accordion__button flush--bottom w-100 no-border"
            :class="disabled ? 'cursor--default' : 'cursor--pointer'"
            :disabled="disabled"
            :aria-expanded="isOpen"
            :aria-controls="panelId"
            :aria-label="headerLabel"
            @click="toggle"
        >
            <span v-if="hasCount" class="status-header__number push-half--right epsilon" aria-hidden="true">
                <span class="status-indicator" :class="`status--rag--${statusColour}`" :title="statusText">
                    <span class="status-indicator__label">{{ count }}</span>
                </span>
            </span>
            <span class="status-header__name push--right--desk push-half--right--below-desk" aria-hidden="true">
                {{ statusText }}
            </span>
            <span class="status-header__tags" :class="`status-header__tags--${statusColour}`" aria-hidden="true">
                <span v-if="visibleTags.length" class="status-header__tags-holder">
                    <span
                        v-for="(tag, index) in visibleTags"
                        :key="tag.label"
                        class="status-badge"
                        :class="[`status-badge--rag--${tag.colour || statusColour}`, { 'push-half--left': index > 0 }]"
                        :title="tag.description"
                    >
                        <template v-if="tag.count != null">
                            {{ tag.count }} <span class="d-none d-md-inline">- {{ tag.label }}</span>
                        </template>
                        <template v-else>{{ tag.label }}</template>
                    </span>
                </span>
            </span>
            <span v-if="statusIcon" class="status-header__icon epsilon push-half--left--below-desk" aria-hidden="true">
                <span class="status-indicator" :class="`status--rag--${statusColour}`" :title="statusText">
                    <span class="status-indicator__label">
                        <span :class="statusIcon"></span>
                    </span>
                </span>
            </span>
            <span class="status-header__state delta push-half--left" aria-hidden="true">
                <span :class="[isOpen ? 'entypo--up-circled' : 'entypo--down-circled', { 'inactive': disabled }]"></span>
            </span>
        </button>

        <div
            class="status-accordion__transition"
            :class="{ 'is-open': isOpen, 'is-settled': isSettled }"
            @transitionend.self="onTransitionEnd"
        >
            <div
                :id="panelId"
                class="status-accordion__content"
                role="region"
                :aria-labelledby="headerId"
            >
                <slot :is-open="isOpen" />
            </div>
        </div>
    </div>
</template>

<script setup>
import { ref, computed, watch, useId } from 'vue'

const props = defineProps({
    // optional - the number indicator is hidden when omitted
    count: { type: Number, default: undefined },
    statusText: { type: String, required: true },
    statusColour: { type: String, default: '' },
    statusIcon: { type: String, default: '' },
    // [{ label, count?, colour?, description? }] - lozenges with a count of 0 are hidden,
    // lozenges with no count show their label only
    tags: { type: Array, default: () => [] },
    disabled: { type: Boolean, default: false },
});

// Use v-model:open to control from the parent, or leave unbound for internal state
const isOpen = defineModel('open', { type: Boolean, default: false });

const headerId = useId()
const panelId = useId()

const hasCount = computed(() => props.count != null)
const visibleTags = computed(() => props.tags.filter(tag => tag.count !== 0))

// The visual header content is aria-hidden, so the full summary is read out from here
const headerLabel = computed(() => {
    const status = hasCount.value ? `${props.statusText}: ${props.count}` : props.statusText
    const tagSummary = visibleTags.value
        .map(tag => (tag.count != null ? `${tag.count} ${tag.label}` : tag.label))
        .join(', ')
    return [status, tagSummary].filter(Boolean).join('. ')
})

function toggle() {
    if (props.disabled) return
    isOpen.value = !isOpen.value
}

// close if it becomes disabled while open (e.g. the last item moved to another stage)
watch(() => props.disabled, disabled => {
    if (disabled) isOpen.value = false
})

// content is clipped while animating, then unclipped once fully open
// so dropdowns/tooltips inside (e.g. tippy) aren't cut off
const prefersReducedMotion = () => window.matchMedia?.('(prefers-reduced-motion: reduce)').matches
const isSettled = ref(isOpen.value)

watch(isOpen, open => {
    // no transition runs with reduced motion, so settle straight away
    isSettled.value = open && prefersReducedMotion()
})

function onTransitionEnd(event) {
    if (event.propertyName === 'opacity' && isOpen.value) isSettled.value = true
}
</script>

<style lang="scss" scoped>
// reset native button styling so the header looks the same as the live div version
.status-accordion__button {
    display: flex;
    align-items: center;
    background: none;
    color: inherit;
    font: inherit;
    text-align: left;
    padding: 0;
}

// TEMPORARY: copied from the live component while it's in testing.
// Remove once these styles are in the Perspective stylesheet loaded in .storybook/preview-head.html
.status-accordion {
    &__transition {
        display: grid;
        grid-template-rows: 0fr;
        opacity: 0;
        transition: grid-template-rows 0.3s ease, opacity 0.3s ease, visibility 0s 0.3s;
        visibility: hidden;

        &.is-open {
            grid-template-rows: 1fr;
            opacity: 1;
            visibility: visible;
            transition-delay: 0s;
        }

        @media (prefers-reduced-motion: reduce) {
            transition: none;
        }
    }

    &__content {
        min-height: 0;
        overflow: hidden;
    }
}

// dropdowns inside aren't clipped
.status-accordion__transition.is-settled .status-accordion__content {
    overflow: visible;
}
</style>
