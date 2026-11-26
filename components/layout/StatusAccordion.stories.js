import StatusAccordion from './StatusAccordion.vue'

export default {
  title: 'Components/Layout/Status Accordion',
  component: StatusAccordion,
  tags: ['autodocs'],
  argTypes: {
    initiallyExpanded: {
      control: 'select',
      options: [null, 'start', 'draft', 'active', 'closing', 'closed'],
      description: 'Status key (or array of keys) expanded on mount. Read once, never persisted.',
    },
    statuses: {
      control: 'object',
      description: 'Per-status data: `{ key, count?, tags?: [{ label, count?, colour?, description? }], disabled? }`',
    },
  },
  parameters: {
    docs: {
      description: {
        component: `
Groups content under five statuses: **Start, Draft, Active, Closing, Closed**. Each group expands and collapses independently.

**Content:** provide one named slot per status: \`#start\`, \`#draft\`, \`#active\`, \`#closing\`, \`#closed\`. Each slot receives \`{ isOpen, status }\`.

**Lozenges (substatuses):** \`tags: [{ label, count?, colour?, description? }]\`. A lozenge with no count shows only its label. A lozenge with \`count: 0\` is hidden. Omit \`count\` on a status to hide its number.

On live this holds a table of reviews for each status. The table is passed in through the slots and is not part of this component.
        `,
      },
    },
  },
}

/* ---------- sample data ---------- */

const NAMES = [
  'Amira Khan', 'Ben Taylor', 'Chloe Evans', 'Daniel Wright', 'Ella Hughes', 'Finn Walker',
  'Grace Patel', 'Harry Green', 'Isla Roberts', 'Jack Thompson', 'Katie Lewis', 'Liam Hall',
  'Maya Clarke', 'Noah Wood', 'Olivia Harris', 'Priya Shah', 'Ruby Martin', 'Sam Cooper',
  'Tom Baker', 'Zara Ahmed',
]
const REVIEWERS = ['J. Smith', 'A. Patel', 'R. Jones']

let nameIndex = 0
function makeRows(count, extra = {}) {
  return Array.from({ length: count }, (_, i) => ({
    reviewee: NAMES[nameIndex++ % NAMES.length],
    reviewer: REVIEWERS[i % REVIEWERS.length],
    date: `${String(3 + i * 2).padStart(2, '0')}/12/2026`,
    targets: (i % 4) + 1,
    cpdNeeds: i % 3,
    ...extra,
  }))
}

// substatuses that split a table into sections (matches the live allReviewsTable behaviour)
const SUB_STATUSES = {
  notScheduled: { label: 'Not Scheduled', colour: 'grey' },
  scheduled: { label: 'Scheduled', colour: 'amber' },
  pendingFeedback: { label: 'Pending Feedback', colour: 'purple' },
  notAgreed: { label: 'Not Agreed', colour: 'red' },
}

const rowsByStatus = {
  start: [
    ...makeRows(3, { subStatus: 'notScheduled' }),
    ...makeRows(2, { subStatus: 'scheduled' }),
  ],
  draft: [
    ...makeRows(3, { subStatus: 'pendingFeedback' }),
    ...makeRows(1, { subStatus: 'notAgreed' }),
  ],
  active: makeRows(8),
  closing: [
    ...makeRows(2, { subStatus: 'pendingFeedback' }),
    ...makeRows(1, { subStatus: 'notAgreed' }),
  ],
  closed: makeRows(12),
}

const sampleStatuses = [
  { key: 'start', count: 5, tags: [
    { label: 'Not Scheduled', count: 3, colour: 'grey' },
    { label: 'Scheduled', count: 2, colour: 'amber' },
  ] },
  { key: 'draft', count: 4, tags: [
    { label: 'Pending Feedback', count: 3, colour: 'purple' },
    { label: 'Not Agreed', count: 1, colour: 'red' },
  ] },
  { key: 'active', count: 8 },
  { key: 'closing', count: 3, tags: [
    { label: 'Pending Feedback', count: 2, colour: 'purple' },
    { label: 'Not Agreed', count: 1, colour: 'red' },
  ] },
  { key: 'closed', count: 12 },
]

/* ---------- story-only table (stands in for the live allReviewsTable) ---------- */

const SampleReviewsTable = {
  props: {
    rows: { type: Array, default: () => [] },
  },
  setup(props) {
    const subStatuses = SUB_STATUSES
    const counts = props.rows.reduce((acc, row) => {
      if (row.subStatus) acc[row.subStatus] = (acc[row.subStatus] ?? 0) + 1
      return acc
    }, {})
    // a substatus section starts wherever the substatus changes
    const isFirstOfSubStatus = (row, index) =>
      !!row.subStatus && (index === 0 || props.rows[index - 1].subStatus !== row.subStatus)
    return { subStatuses, counts, isFirstOfSubStatus }
  },
  template: `
    <table class="table table--pm-style table--responsive push-half--top">
      <thead>
        <tr>
          <th style="width:20%">{{ $filters.terminology('{#Reviewee$}') }}</th>
          <th style="width:20%">{{ $filters.terminology('{#Reviewer$}') }}</th>
          <th style="width:12%">Date</th>
          <th style="width:10%">{{ $filters.terminology('{#Target s$}') }}</th>
          <th style="width:10%">{{ $filters.terminology('{#Cpdneed s$}') }}</th>
          <th style="width:8%">Reports</th>
          <th style="width:8%">Reassign</th>
          <th>Edit</th>
        </tr>
      </thead>
      <tbody>
        <template v-for="(row, index) in rows" :key="row.reviewee">
          <tr v-if="isFirstOfSubStatus(row, index)" class="status-row">
            <td colspan="8" class="text--left no-content-below-desk">
              <span class="status-badge below-desk-one-whole" :class="'status-badge--rag--' + subStatuses[row.subStatus].colour">
                {{ counts[row.subStatus] }} - {{ subStatuses[row.subStatus].label }}
              </span>
            </td>
          </tr>
          <tr>
            <td>{{ row.reviewee }}</td>
            <td>{{ row.reviewer }}</td>
            <td>{{ row.date }}</td>
            <td>{{ row.targets }}</td>
            <td>{{ row.cpdNeeds }}</td>
            <td><a href="#" :aria-label="'Reports for ' + row.reviewee"><span class="entypo--doc-text" aria-hidden="true"></span></a></td>
            <td><a href="#" :aria-label="'Reassign ' + row.reviewee"><span class="entypo--users-1" aria-hidden="true"></span></a></td>
            <td><a href="#" :aria-label="'Edit ' + row.reviewee"><span class="entypo--pencil" aria-hidden="true"></span></a></td>
          </tr>
        </template>
      </tbody>
    </table>
  `,
}

/* ---------- stories ---------- */

// :key on initiallyExpanded remounts the component when the control changes,
// because the prop is only read once on mount
export const AllStatuses = (args) => ({
  components: { StatusAccordion, SampleReviewsTable },
  setup() { return { args, rowsByStatus } },
  template: `
    <StatusAccordion v-bind="args" :key="String(args.initiallyExpanded)">
      <template v-for="(rows, status) in rowsByStatus" #[status]>
        <SampleReviewsTable :rows="rows" />
      </template>
    </StatusAccordion>
  `,
})
AllStatuses.args = {
  statuses: sampleStatuses,
  initiallyExpanded: 'start',
}
AllStatuses.parameters = {
  docs: {
    description: {
      story: 'How this is used on live: a table of reviews for each status. Each status with substatus lozenges splits its table into matching sections: **Start** has Not Scheduled and Scheduled, and **Draft** and **Closing** have Pending Feedback and Not Agreed.',
    },
  },
}

export const CustomContentPerStatus = (args) => ({
  components: { StatusAccordion },
  setup() { return { args } },
  template: `
    <StatusAccordion v-bind="args" :key="String(args.initiallyExpanded)">
      <template #start>
        <p class="push-half--top">Nothing has been set up yet. <a href="#">Create the first item</a>.</p>
      </template>
      <template #draft>
        <ul class="push-half--top">
          <li>Maths curriculum plan</li>
          <li>Reading intervention</li>
          <li>Attendance strategy</li>
        </ul>
      </template>
      <template #active="{ status }">
        <p class="push-half--top">{{ status.count }} items are currently active.</p>
      </template>
      <template #closing>
        <p class="push-half--top">Items going through final checks.</p>
      </template>
      <template #closed="{ isOpen }">
        <p class="push-half--top">Archived items. Slot props also expose <code>isOpen</code>: {{ isOpen }}</p>
      </template>
    </StatusAccordion>
  `,
})
CustomContentPerStatus.args = {
  // headers kept simple so they match the slot content below
  statuses: [
    { key: 'start' },
    { key: 'draft', count: 3 },
    { key: 'active', count: 6 },
    { key: 'closing', count: 2 },
    { key: 'closed', count: 10 },
  ],
  initiallyExpanded: 'draft',
}
CustomContentPerStatus.parameters = {
  docs: {
    description: {
      story: 'The component is not tied to tables. Each named slot (`#start`, `#draft`, `#active`, `#closing`, `#closed`) can hold any content.',
    },
  },
}
