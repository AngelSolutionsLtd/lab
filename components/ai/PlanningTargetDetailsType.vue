<template>
  <div class="row mb-3 align-items-center">
    <div v-if="showResponsible && (isTeamTarget || isNewTarget && canCreateTeamTargets)" class="col-12 col-md-6">
      <div class="d-flex align-items-center edit-target__target-type">
        <input
          id="personal"
          type="radio"
          name="targetType"
          class="form-accent-color--psp radio-large mr-2"
          :class="{ inactive: isTeamTarget && !isNewTarget || target.isInDevPlan }"
          :checked="modelValue === targetTypes.Personal"
          :value="targetTypes.Personal"
          @change="onTypeChange(targetTypes.Personal)"
        />
        <label
          for="personal"
          class="display--inline mr-3 mt-0"
          :class="{ inactive: isTeamTarget && !isNewTarget || target.isInDevPlan }"
        >
          Personal
        </label>

        <input
          id="team"
          type="radio"
          name="targetType"
          class="form-accent-color--psp radio-large mr-2"
          :class="{ inactive: !canCreateTeamTargets && !isNewTarget || target.isInReview }"
          :checked="modelValue === targetTypes.Team"
          :value="targetTypes.Team"
          @change="onTypeChange(targetTypes.Team)"
        />
        <label
          for="team"
          class="display--inline mr-3 mt-0"
          :class="{ inactive: !canCreateTeamTargets && !isNewTarget || target.isInReview }"
        >
          Team
        </label>
      </div>
    </div>

    <div v-if="showResponsible" class="col-12 col-md-6">
      <div v-if="modelValue == targetTypes.Team">
        <label>Team:</label>
        <select id="ddlTeam" :value="target.teamPublicId" @change="onTeamChange($event.target.value)">
          <option v-for="team in teamOptions" :key="team.publicId" :value="team.publicId">
            {{ team.nameWithCode }}
          </option>
        </select>
      </div>
      <hr v-else-if="isTeamTarget || isNewTarget && canCreateTeamTargets" class="rule" />
    </div>
  </div>
</template>

<script setup>
import { computed } from 'vue';
import ETargetType from './ETargetType.js';

const emit = defineEmits(['update:modelValue', 'team-changed']);

const props = defineProps({
  target: { type: Object, required: true },
  teams: { type: Array, default: () => [] },
  teamsForTarget: { type: Array, default: () => [] },
  showResponsible: { type: Boolean, default: false },
  modelValue: { type: [String, Number], default: () => ETargetType.Personal },
});

const targetTypes = ETargetType;

const isNewTarget = computed(() => props.target.publicId == null);
const isTeamTarget = computed(() => props.target.teamPublicId);
const canCreateTeamTargets = computed(() => props.teams && props.teams.length);
const teamOptions = computed(() => isNewTarget.value ? props.teams : props.teamsForTarget);

function onTypeChange(value) {
  if (!canCreateTeamTargets.value) return;

  if (isNewTarget.value && !props.target.isInDevPlan && !props.target?.isInReview) {
    emit('update:modelValue', value);
  } else if (isNewTarget.value && props.target?.isInReview) {
    emit('update:modelValue', ETargetType.Personal);
  } else if (value === ETargetType.Team) {
    emit('update:modelValue', value);
  }
}

function onTeamChange(teamPublicId) {
  emit('team-changed', teamPublicId);
}
</script>
