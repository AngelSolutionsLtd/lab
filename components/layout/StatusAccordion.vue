<template>
    <div class="status-accordion-list">
        <StatusAccordionGroup
            v-for="status in resolvedStatuses"
            :key="status.key"
            v-model:open="open[status.key]"
            class="push-half--bottom"
            :status-text="status.statusText"
            :status-colour="status.statusColour"
            :status-icon="status.statusIcon"
            :count="status.count"
            :tags="status.tags"
            :disabled="status.disabled"
        >
            <template #default="{ isOpen }">
                <slot :name="status.key" :is-open="isOpen" :status="status" />
            </template>
        </StatusAccordionGroup>
    </div>
</template>

<script setup>
import { ref, computed } from 'vue'
import StatusAccordionGroup from './StatusAccordionGroup.vue'

// Default look for each status. Consumers can override any field per status.
const STATUS_DEFAULTS = {
    start:   { statusText: 'Start',   statusColour: 'yellow',  statusIcon: 'entypo--calendar' },
    draft:   { statusText: 'Draft',   statusColour: 'amber',  statusIcon: 'entypo--pencil' },
    active:  { statusText: 'Active',  statusColour: 'green', statusIcon: 'entypo--check' },
    closing: { statusText: 'Closing', statusColour: 'teal', statusIcon: 'entypo--menu' },
    closed:  { statusText: 'Closed',  statusColour: 'blue',   statusIcon: 'entypo--check' },
}

const STATUS_KEYS = Object.keys(STATUS_DEFAULTS)

const props = defineProps({
    // [{ key, count?, tags?, disabled?, statusText?, statusColour?, statusIcon? }]
    // Statuses render in the fixed Start → Closed order; any not supplied still render with no data.
    statuses: { type: Array, default: () => [] },
    // Status key (or array of keys) expanded on mount. Only read once - not persisted or synced.
    initiallyExpanded: {
        type: [String, Array],
        default: null,
        // keys are inlined because defineProps is hoisted and can't see STATUS_KEYS
        validator: value => [].concat(value ?? [])
            .every(key => ['start', 'draft', 'active', 'closing', 'closed'].includes(key)),
    },
})

const resolvedStatuses = computed(() => STATUS_KEYS.map(key => ({
    key,
    ...STATUS_DEFAULTS[key],
    ...props.statuses.find(status => status.key === key),
})))

// each status owns its own open state, so toggling one never affects the others
const initial = [].concat(props.initiallyExpanded ?? [])
const open = ref(Object.fromEntries(STATUS_KEYS.map(key => [key, initial.includes(key)])))
</script>
