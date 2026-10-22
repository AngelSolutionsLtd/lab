<template>
    <div class="mb-4 simple-accordion">
        <button :class="{ 'weight--bold': isOpen }" :aria-expanded="isOpen" :aria-controls="panelId" type="button" class="simple-accordion__button d-flex align-items-center justify-content-between border-1--bottom cursor--pointer pb-1 mb-1 w-100 no-border p-0" @click="$emit('toggle')">
            {{ title }}
            <i class="ft-18" :class="isOpen ? 'entypo--up-open' : 'entypo--down-open'" aria-hidden="true" />
        </button>
        <div class="simple-accordion__transition" :class="{ 'is-open': isOpen }" >
            <div :id="panelId" class="simple-accordion__content w-md-50 w-lg-100">
                <slot>
                    <div v-html="content" />
                </slot>
            </div>
        </div>
    </div>
</template>

<script setup> 
import { useId } from 'vue'

defineProps({
    title: { type: String, required: true },
    content: { type: String, default: '' },
    isOpen: { type: Boolean, default: false },
});

defineEmits(['toggle']);

const panelId = useId()
</script>

<style scoped>
.simple-accordion__button {
    background: none;
    color: inherit;
    text-align: left;
}

.simple-accordion__transition {
    display: none;
}

.simple-accordion__transition.is-open {
    display: block;
}
</style>