<template>
  <div class="planning-target-summary form-fields text--left">
    <PlanningTargetDetailsType
      v-model="targetType"
      :target="newTarget"
      :teams="teams"
      :teams-for-target="teamsForTarget"
      :show-responsible="true"
      @team-changed="emit('team-changed', $event)"
    />

    <p class="size--14 mb-2 mb-3">
      Enter a short summary of your target. TILDA will use this to generate a draft title,
      description, and strategy. You can then add your own success criteria
      and actions, or let TILDA suggest them.
    </p>

    <div class="tilda-textarea-wrapper mb-5" :class="{ 'is-generating': generating }">
      <textarea
        v-if="voiceProvider === 'none'"
        ref="summaryInput"
        id="targetSummary"
        v-model="targetSummaryText"
        rows="8"
        :placeholder="summaryPlaceholder"
      ></textarea>

      <DeepgramVoiceInput
        v-else-if="voiceProvider === 'deepgram'"
        id="targetSummary"
        v-model="targetSummaryText"
        :placeholder="summaryPlaceholder"
        :disabled="generating"
        :deepgram-api-key="deepgramApiKey"
        :silence-timeout="10"
      />

      <VoiceInput
        v-else-if="voiceProvider === 'webspeech'"
        id="targetSummary"
        :value="targetSummaryText"
        :placeholder="summaryPlaceholder"
        :disabled="generating"
        @input="targetSummaryText = $event"
      />

      <div v-if="generating" class="tilda-textarea-overlay">
        <TildaLoadingSpinner />
        <span class="tilda-textarea-overlay__text">Generating Target…</span>
      </div>
    </div>

    <TildaApiErrorView v-if="apiErrorType" :error-type="apiErrorType" />
  </div>
</template>

<script setup>
import { ref, computed } from 'vue';
import TildaLoadingSpinner from './TildaLoadingSpinner.vue';
import TildaApiErrorView from './shared/tilda-api-error-view.vue';
import PlanningTargetDetailsType from './PlanningTargetDetailsType.vue';
import DeepgramVoiceInput from '../forms/voice-input/DeepgramVoiceInput.vue';
import VoiceInput from '../forms/voice-input/VoiceInput.vue';

const props = defineProps({
  newTarget: { type: Object, required: true },
  teams: { type: Array, default: () => [] },
  teamsForTarget: { type: Array, default: () => [] },
  voiceProvider: { type: String, default: 'none' }, // 'none' | 'deepgram' | 'webspeech'
  deepgramApiKey: { type: String, default: '' },
});

const targetSummaryText = defineModel('summary', { default: '' });
const targetType = defineModel('targetType');
const generating = defineModel('generating', { default: false });
const apiErrorType = defineModel('apiErrorType', { default: '' });

const emit = defineEmits(['generated', 'team-changed']);

const summaryInput = ref(null);

const summaryPlaceholder = computed(() => {
  const team = props.teams.find(t => t.publicId === props.newTarget?.teamPublicId);
  return team
    ? `Summarise the target you want to generate for ${team.name}.`
    : 'Summarise the target you want to generate.';
});

async function generate() {
  if (!targetSummaryText.value.trim()) return;

  generating.value = true;
  apiErrorType.value = '';

  try {
    // Mocked — replace with real Vuex action in production
    await new Promise(resolve => setTimeout(resolve, 2000));

    emit('generated', {
      title: `Generated: ${targetSummaryText.value.slice(0, 50)}`,
      description: 'This is a generated description based on your summary. It outlines the key focus areas and expected outcomes for this target.',
      strategy: 'The strategy involves a structured approach to achieving the target through regular review, team engagement, and data-informed decision making.',
    });
  } catch (err) {
    console.error('Failed to generate target', err);
    apiErrorType.value = mapApiErrorToType(err);
  } finally {
    generating.value = false;
  }
}

defineExpose({ generate });

function mapApiErrorToType(error) {
  const status = error?.response?.status;
  const message = error?.message?.toLowerCase?.() || '';
  if ([500, 501, 502, 503, 504].includes(status)) return 'AI_UNAVAILABLE';
  if (message.includes('timeout')) return 'TIMEOUT';
  if (message.includes('network') || status === 0) return 'NETWORK_ERROR';
  return 'UNKNOWN_ERROR';
}
</script>

