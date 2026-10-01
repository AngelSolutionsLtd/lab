<template>
  <table ref="table" class="table table--planning-style table--responsive dev-plan">
    <thead>
      <tr>
        <th width="100">
          <label for="refall" class="check-box check-box--green check-box--small">
            <input class="vertical-align--middle" type="checkbox" id="refall" name="Select All"
              v-model="areAllTargetsSelected" />
            <span class="push-half--right"></span>
          </label>
          Ref
        </th>
        <th width="8%">RAG</th>
        <th>TITLE</th>
        <th>TEAM</th>
        <th>RESPONSIBLE</th>
        <th>PRIORITY</th>
        <th width="135">DEADLINE</th>
        <th width="12%">STATUS</th>
        <th class="text-lg-center" width="100">REORDER</th>
        <th width="90">OPTIONS</th>
        <th>&nbsp;</th>
      </tr>
    </thead>

    <draggable 
      tag="tbody" 
      v-model="devPlanTargets" 
      class="list-group" 
      v-bind="dragOptions"
      handle=".handle"
      drag-class="drag-row"
      :disabled="isMobile"
      @start="dragging = true" 
      @end="dragging = false"
      :itemKey="'publicId'"      
    >
      <template #item="{ element, index }">
        <tr>
          <td>
            <label :for="`ref${element.publicId}`" class="check-box check-box--green check-box--small">
              <input class="vertical-align--middle" type="checkbox" :id="`ref${element.publicId}`"
                :value="element.publicId" v-model="selectedTargetIds" />
              <span class="push-half--right"></span>
            </label>
            {{ index + 1 }}
          </td>
          <td><span :class="`rag rag--${element.rag}`">{{ element.rag }}</span></td>
          <td>{{ element.title }}</td>
          <td>{{ element.team }}</td>
          <td>{{ element.responsible }}</td>
          <td>{{ element.priority }}</td>
          <td>{{ element.deadline }}</td>
          <td>{{ element.status }}</td>
          <td class="text-lg-center"><span class="entypo--reorder handle"></span></td>
          <td><button type="button" @click="editTarget(element)">Edit</button></td>
          <td>&nbsp;</td>
        </tr>
      </template>
    </draggable>
  </table>
</template>

<script setup>
import { computed, ref } from "vue";
import draggable from "vuedraggable";

const targets = ref([
  {
    publicId: "t-001",
    rag: "green",
    title: "Title",
    team: "Team 1",
    responsible: "A. Smith",
    priority: "High",
    deadline: "31/12/2025",
    status: "In progress"
  },
  {
    publicId: "t-002",
    rag: "amber",
    title: "Title",
    team: "Team 2",
    responsible: "B. Jones",
    priority: "Medium",
    deadline: "28/02/2026",
    status: "Not started"
  },
  {
    publicId: "t-003",
    rag: "red",
    title: "Title",
    team: "Team 3",
    responsible: "C. Patel",
    priority: "High",
    deadline: "31/03/2026",
    status: "At risk"
  }
]);

const selectedTargetIds = ref([]);

const dragging = ref(false);

const dragOptions = {
  animation: 200,
  group: "targets",
  ghostClass: "ghost"
};

const devPlanTargets = computed({
  get() {
    return targets.value;
  },
  set(newOrder) {
    targets.value = newOrder;
  }
});

function editTarget() {
  console.log("editTarget");
}
</script>