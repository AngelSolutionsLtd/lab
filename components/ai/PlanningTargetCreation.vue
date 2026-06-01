<template>
  <Modal
    v-if="open"
    classes="modal--full-page"
    :dismissible="true"
    @close="tryCloseModal"
  >
    <template #header>
      <h1>Create New Target</h1>
    </template>

    <template #default>
      <PlanningTargetSummary
        v-if="step === 1"
        ref="generateStepRef"
        v-model:summary="targetSummaryText"
        v-model:target-type="targetType"
        v-model:generating="generating"
        v-model:api-error-type="apiErrorType"
        :new-target="newTarget"
        :teams="teams"
        :teams-for-target="teamsForTarget"
        :voice-provider="voiceProvider"
        :deepgram-api-key="deepgramApiKey"
        @team-changed="onTeamChanged"
        @generated="onGenerated"
      />

      <PlanningTargetEdit
        v-if="step === 2"
        ref="editStepRef"
        v-model="generatedTarget"
        :target="newTarget"
        :generated-s-c-actions="AIActive"
        @save="onSave"
      />
    </template>

    <template #footer>
      <div class="row no-gutters w-100">

        <!-- Step 1 footer -->
        <template v-if="step === 1">
          <div class="col-12">
            <transition name="slide-right" mode="out-in">
              <div v-if="showCancelBottomPrompt" key="confirm" class="footer-row footer-row--confirm">
                <p class="footer-confirm-text">
                  <strong>Are you sure?</strong><br>You'll lose your changes.
                </p>
                <div class="d-flex">
                  <button class="btn btn--secondary--inverted mr-4" @click.prevent="showCancelBottomPrompt = false">
                    Continue Editing
                  </button>
                  <button class="btn" @click.prevent="closeModal">
                    Discard &amp; Exit
                  </button>
                </div>
              </div>

              <div v-else key="normal" class="footer-row">
                <button class="btn btn--secondary--inverted" @click.prevent="tryCloseModal">
                  Cancel
                </button>
                <div class="d-flex align-items-center">
                  <button v-if="apiErrorType" class="btn btn--secondary no-border mr-2" @click.prevent="onCreateManually">
                    Create Manually
                  </button>
                  <LoadingButton
                    :loading="generating"
                    :disabled="generating || !targetSummaryText.trim()"
                    :button-text="apiErrorType ? 'Try Again' : 'Tilda: Generate'"
                    button-class="btn btn--tilda"
                    icon="entypo--twinkle"
                    loader-style="spinner"
                    @buttonClicked="generateStepRef?.generate()"
                  />
                </div>
              </div>
            </transition>
          </div>
        </template>

        <!-- Step 2 footer -->
        <template v-if="step === 2">
          <div class="col-12">
            <transition name="slide-right" mode="out-in">
              <div v-if="showCancelBottomPrompt" key="confirm" class="footer-row footer-row--confirm">
                <p class="footer-confirm-text">
                  <strong>Are you sure?</strong><br>You'll lose your changes.
                </p>
                <div class="d-flex">
                  <button class="btn btn--secondary--inverted mr-4" @click.prevent="showCancelBottomPrompt = false">
                    Continue Editing
                  </button>
                  <button class="btn" @click.prevent="closeModal">
                    Discard &amp; Exit
                  </button>
                </div>
              </div>

              <div v-else key="normal" class="footer-row">
                <button class="btn btn--secondary--inverted" @click.prevent="tryCloseModal">
                  Cancel
                </button>

                <div class="d-flex flex-column align-items-end">
                  <div v-if="!editStepRef?.addTargetStep" class="d-flex align-items-center mb-3">
                    <p class="footer-ai-label">Generate Success Criteria &amp; Actions for me</p>
                    <ToggleSwitch
                      class="switch--tilda"
                      on-text=""
                      off-text=""
                      :value="AIActive"
                      @input="AIActive = $event"
                    />
                  </div>

                  <div class="d-flex align-items-center">
                    <button v-if="apiErrorType || editStepRef?.apiErrorType" class="btn btn--secondary no-border mr-2" @click.prevent="onCreateManually">
                      Create Manually
                    </button>

                    <LoadingButton
                      v-if="!editStepRef?.addTargetStep"
                      :loading="editStepRef?.isGenerating"
                      :disabled="!editStepRef?.hasValidTitle || editStepRef?.isGenerating"
                      :button-text="editStepRef?.apiErrorType && AIActive ? 'Try Again' : 'Continue'"
                      :button-class="`btn ${AIActive ? 'btn--tilda' : 'btn--positive'}`"
                      :icon="AIActive ? 'entypo--twinkle' : 'entypo--check'"
                      loader-style="spinner"
                      @buttonClicked="editStepRef?.onContinue()"
                    />

                    <button
                      v-else
                      class="btn btn--positive"
                      :class="{ inactive: !editStepRef?.hasValidTitle }"
                      @click.prevent="editStepRef?.saveTarget()"
                    >
                      <span class="entypo--check mr-2" />
                      Add Target
                    </button>
                  </div>
                </div>
              </div>
            </transition>
          </div>
        </template>

      </div>
    </template>
  </Modal>
</template>

<script setup>
import { ref, computed, watch } from 'vue';
import Modal from '../overlays/Modal.vue';
import LoadingButton from '../forms/LoadingButton.vue';
import ToggleSwitch from '../forms/ToggleSwitch.vue';
import PlanningTargetSummary from './PlanningTargetSummary.vue';
import PlanningTargetEdit from './PlanningTargetEdit.vue';
import ETargetType from './ETargetType.js';

const props = defineProps({
  open: { type: Boolean, required: true },
  teams: { type: Array, default: () => [] },
  defaultTeamId: { type: String, default: null },
  voiceProvider: { type: String, default: 'none' }, // 'none' | 'deepgram' | 'webspeech'
  deepgramApiKey: { type: String, default: '' },
});

const emit = defineEmits(['close-modal', 'create-manually', 'add-new']);

const step = ref(1);
const generateStepRef = ref(null);
const editStepRef = ref(null);

const targetSummaryText = ref('');
const targetType = ref(ETargetType.Team);
const teamsForTarget = ref([]);
const generating = ref(false);
const apiErrorType = ref('');
const showCancelBottomPrompt = ref(false);

const generatedTarget = ref(null);
const AIActive = ref(true);

const newTarget = ref({ publicId: null, teamPublicId: null, isInDevPlan: true, isInReview: false });

const defaultTeam = computed(() => {
  if (!props.teams.length) return null;
  if (props.defaultTeamId) return props.teams.find(t => t.publicId === props.defaultTeamId) ?? props.teams[0];
  return props.teams.find(t => t.isSlt) ?? props.teams[0];
});

function onGenerated(result) {
  generatedTarget.value = result;
  step.value = 2;
}

function onTeamChanged(teamId) {
  newTarget.value.teamPublicId = teamId;
}

function tryCloseModal() {
  if (targetSummaryText.value.trim()) {
    showCancelBottomPrompt.value = true;
  } else {
    closeModal();
  }
}

function onCreateManually() {
  closeModal();
  emit('create-manually');
}

function onSave(target) {
  emit('add-new', target);
  closeModal();
}

function closeModal() {
  showCancelBottomPrompt.value = false;
  step.value = 1;
  targetSummaryText.value = '';
  apiErrorType.value = '';
  generatedTarget.value = null;
  newTarget.value = { publicId: null, teamPublicId: null, isInDevPlan: true, isInReview: false };
  AIActive.value = true;
  emit('close-modal');
}

watch([defaultTeam, () => props.open], ([team, isOpen]) => {
  if (team && (isOpen || !newTarget.value.teamPublicId)) {
    newTarget.value.teamPublicId = team.publicId;
  }
}, { immediate: true });

watch(targetSummaryText, () => {
  if (apiErrorType.value) apiErrorType.value = '';
});

watch(AIActive, (isActive) => {
  if (!isActive && editStepRef.value) editStepRef.value.apiErrorType = '';
});
</script>

<style scoped>
.footer-row {
  display: flex;
  align-items: center;
  justify-content: space-between;
  width: 100%;
}

.footer-row--confirm {
  flex-wrap: wrap;
  gap: 1rem;
}

.footer-confirm-text {
  font-size: 0.875rem;
  font-style: italic;
  margin: 0;
  text-align: left;
}

.footer-ai-label {
  font-size: 0.875rem;
  font-weight: 600;
  margin: 0 0.75rem 0 0;
  color: #555;
}

.slide-right-enter-active,
.slide-right-leave-active {
  transition: all 0.2s ease;
}

.slide-right-enter-from {
  opacity: 0;
  transform: translateX(12px);
}

.slide-right-leave-to {
  opacity: 0;
  transform: translateX(-12px);
}

.d-flex { display: flex; }
.align-items-center { align-items: center; }
.align-items-end { align-items: flex-end; }
.flex-column { flex-direction: column; }
.mr-2 { margin-right: 0.5rem; }
.mr-4 { margin-right: 1rem; }
.mb-3 { margin-bottom: 0.75rem; }
.no-border { border: none; }
.w-100 { width: 100%; }
</style>
