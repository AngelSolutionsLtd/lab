import AppShell from '../../components/layout/AppShell.vue';
import TildaChat from '../../components/ai/TildaChat.vue';

export default {
  title: 'Pages/Visits',
  parameters: {
    layout: 'fullscreen',
  },
  decorators: [
    () => ({
      components: { AppShell },
      template: `<AppShell :fullWidth="false"><story /></AppShell>`,
    }),
  ],
};

const visits = [
  {
    school: 'Oakwood Secondary Academy',
    urn: '1234501',
    extraSchools: 0,
    adviser: 'Sarah Mitchell',
    extraAdvisers: 0,
    date: '26/06/25',
    overdue: true,
    status: 'Draft',
    focus: 'Quality of Education',
    orgVisibility: 'private',
    schoolVisibility: 'amber',
  },
  {
    school: 'Oakwood Secondary Academy',
    urn: '1234501',
    extraSchools: 0,
    adviser: 'James Turner',
    extraAdvisers: 0,
    date: '26/06/25',
    overdue: true,
    status: 'Draft',
    focus: 'Behaviour & Attitudes',
    orgVisibility: 'all',
    schoolVisibility: 'amber',
  },
  {
    school: 'Oakwood Secondary Academy',
    urn: '1234501',
    extraSchools: 0,
    adviser: 'James Turner',
    extraAdvisers: 0,
    date: '26/06/25',
    overdue: false,
    status: 'Finalised',
    focus: 'Leadership & Management',
    orgVisibility: 'all',
    schoolVisibility: 'green',
  },
  {
    school: 'Oakwood Secondary Academy',
    urn: '1234501',
    extraSchools: 0,
    adviser: 'James Turner',
    extraAdvisers: 0,
    date: '26/06/25',
    overdue: false,
    status: 'Finalised',
    focus: 'Personal Development',
    orgVisibility: 'groups',
    orgGroups: 5,
    orgUsers: 4,
    schoolVisibility: 'green',
  },
  {
    school: 'Riverside Primary School',
    urn: '2345612',
    extraSchools: 0,
    adviser: 'James Turner',
    extraAdvisers: 0,
    date: '19/06/25',
    overdue: true,
    status: 'Draft',
    focus: 'Safeguarding Review',
    orgVisibility: 'private',
    schoolVisibility: 'amber',
  },
  {
    school: 'Riverside Primary School',
    urn: '2345612',
    extraSchools: 0,
    adviser: 'James Turner',
    extraAdvisers: 0,
    date: '19/06/25',
    overdue: true,
    status: 'Draft',
    focus: 'Curriculum Deep Dive',
    orgVisibility: 'all',
    schoolVisibility: 'amber',
  },
  {
    school: 'Hillcrest Junior School',
    urn: '3456723',
    extraSchools: 1,
    adviser: 'James Turner',
    extraAdvisers: 1,
    date: '22/05/25',
    overdue: true,
    status: 'Draft',
    focus: 'SEND Provision Review',
    orgVisibility: 'groups',
    orgGroups: 5,
    orgUsers: 4,
    schoolVisibility: 'amber',
  },
  {
    school: 'Riverside Primary School',
    urn: '2345612',
    extraSchools: 3,
    adviser: 'James Turner',
    extraAdvisers: 1,
    date: '22/05/25',
    overdue: false,
    status: 'Finalised',
    focus: 'Pupil Premium Strategy',
    orgVisibility: 'all',
    schoolVisibility: 'green',
  },
  {
    school: 'Riverside Primary School',
    urn: '2345612',
    extraSchools: 0,
    adviser: 'James Turner',
    extraAdvisers: 1,
    date: '23/04/25',
    overdue: true,
    status: 'Draft',
    focus: 'Attendance Follow-Up',
    orgVisibility: 'private',
    schoolVisibility: null,
  },
  {
    school: 'Riverside Primary School',
    urn: '2345612',
    extraSchools: 3,
    adviser: 'James Turner',
    extraAdvisers: 1,
    date: '22/04/25',
    overdue: true,
    status: 'Draft',
    focus: 'General Visit',
    orgVisibility: 'private',
    schoolVisibility: null,
  },
];

const visitQuickActions = [
  { label: 'New Visit', icon: 'entypo--plus-circled' },
  { label: 'Export this month', icon: 'entypo--export', type: 'export', filename: 'visits-june-2025.csv' },
  { label: 'Export by date range', icon: 'entypo--calendar', type: 'export', filename: 'visits-custom-range.csv' },
];

const visitInsights = [
  {
    title: '12 visits are still awaiting finalisation',
    body: 'Several are overdue — advisers should prioritise these before end of term.',
    response: {
      summary: 'Over half of your outstanding visits are overdue and need finalising.',
      body: 'Of the 12 visits pending finalisation, the majority are marked as overdue with a flag. Oakwood Secondary Academy and Riverside Primary School account for most of these. Advisers should be prompted to complete their write-ups before the end of term to avoid carry-over.',
      stat: { value: '12', label: 'Visits awaiting finalisation' },
      points: [
        'Oakwood Secondary Academy has 4 overdue draft visits',
        'Riverside Primary School has 3 overdue draft visits',
        'James Turner has the highest volume of outstanding visits',
      ],
      actions: [
        { label: 'View overdue visits', icon: 'entypo--flag' },
        { label: 'Export overdue visits', icon: 'entypo--export', type: 'export', filename: 'overdue-visits-june-2025.csv' },
      ],
    },
  },
  {
    title: 'Riverside Primary has the most incomplete activity',
    body: '5 visits logged — only 1 finalised. Attendance and curriculum visits still in draft.',
    response: {
      summary: 'Riverside Primary School has significant outstanding visit activity.',
      body: 'Five visits have been logged for Riverside Primary School this year, but only one has been finalised. The remaining four are in draft, two of which are overdue. The Attendance Follow-Up and Curriculum Deep Dive visits are the most time-sensitive and should be prioritised.',
      stat: { value: '1 / 5', label: 'Visits finalised at Riverside Primary' },
      points: [
        'Attendance Follow-Up visit has been in draft since 23 April',
        'Curriculum Deep Dive is overdue as of 19 June',
        'Pupil Premium Strategy visit is finalised and visible to school',
      ],
      actions: [
        { label: 'New visit for Riverside Primary', icon: 'entypo--plus-circled' },
        { label: 'Export Riverside visits', icon: 'entypo--export', type: 'export', filename: 'riverside-primary-visits.csv' },
      ],
    },
  },
  {
    title: '2 visits have incomplete actions outstanding',
    body: 'Actions from previous visits haven\'t been marked complete — worth a follow-up.',
    response: {
      summary: 'Two visits have actions that are still open from earlier in the year.',
      body: 'Visit actions are a key accountability mechanism, and having open actions from previous visits can indicate follow-through issues. These should be reviewed with the relevant advisers and either completed or formally carried forward with updated due dates.',
      points: [
        'Check whether actions are still relevant before closing',
        'Update due dates if actions are being carried forward',
        'Consider adding a note to the visit record explaining the delay',
      ],
      actions: [
        { label: 'View incomplete actions', icon: 'entypo--list' },
        { label: 'Export Q1–Q3 visit data', icon: 'entypo--export', type: 'export', filename: 'visits-q1-q3-2025.csv' },
      ],
    },
  },
];

export const Default = () => ({
  components: { TildaChat },
  data() {
    return { visits, visitInsights, visitQuickActions };
  },
  methods: {
    statusClass(status) {
      return status === 'Finalised' ? 'lozenge lozenge--finalised' : 'lozenge lozenge--draft';
    },
  },
  template: `
    <div class="visit-actions-dashboard pt-4">
      <TildaChat :insights="visitInsights" :quick-actions="visitQuickActions" />

      <!-- Page header & filters -->
      <div class="visit-actions-dashboard__header pt-4">
        <div class="page-width">
          <div class="row align-items-center mb-3">
            <div class="col-8 col-lg-10">
              <h1 class="mb-0">Visits</h1>
            </div>
            <div class="col-4 col-lg-2 text-md-right">
              <button class="btn btn--positive">
                <span class="entypo--plus-circled mr-2"></span> New Visit
              </button>
            </div>
          </div>

          <div class="row visit-actions-dashboard__filters">
            <div class="col-12 col-md-3 mb-3">
              <span>School Group:</span>
              <select>
                <option>All Schools</option>
                <option>North Cluster</option>
                <option>South Cluster</option>
                <option>Central MAT</option>
              </select>
            </div>
            <div class="col-12 col-md-3 mb-3">
              <span>Schools:</span>
              <select>
                <option>All Schools (12)</option>
                <option>Birchwood Infant School</option>
                <option>Birchwood Junior School</option>
                <option>Elmfield Primary School</option>
                <option>Greenacres Academy</option>
                <option>Hillcrest Junior School</option>
                <option>Lakeside Nursery</option>
                <option>Meadowview Primary School</option>
                <option>Northgate Secondary Academy</option>
                <option>Oakwood Secondary Academy</option>
                <option>Riverside Primary School</option>
                <option>Sycamore Special School</option>
                <option>Westfield Community School</option>
              </select>
            </div>
            <div class="col-12 col-md-3 mb-3">
              <span>Adviser:</span>
              <select>
                <option>All Visits</option>
                <option>James Turner</option>
                <option>Sarah Mitchell</option>
                <option>Rachel Okafor</option>
              </select>
            </div>
            <div class="col-12 col-md-3 mb-3">
              <span>Date:</span>
              <select>
                <option>All Dates</option>
                <option>This Academic Year</option>
                <option>Previous Academic Year</option>
                <option>Next Academic Year</option>
                <option>Last 30 Days</option>
                <option>Last 60 Days</option>
                <option>Last 90 Days</option>
              </select>
            </div>
          </div>
        </div>
      </div>

      <div class="row">
        <div class="col-12">

          <!-- Stats bar -->
          <div class="row mb-5">
            <div class="col-12">
              <div class="visit-actions-dashboard__visit-stats">
                <div class="row">
                  <div class="col-6 col-md-3 text-center border-1--bottom no-border-md-bottom pb-3 pb-md-0">
                    <div class="visit-actions-dashboard__visit-stat visit-actions-dashboard__visit-stat--overdue">
                      <span class="mb-3">12</span>
                      <p>Visits need <br> finalising</p>
                      <a>View <i class="entypo--down-thin d-none d-lg-inline-block"></i></a>
                    </div>
                  </div>
                  <div class="col-6 col-md-3 text-center line-break border-1--bottom no-border-md-bottom pb-3 pb-md-0">
                    <div class="visit-actions-dashboard__visit-stat">
                      <span>2</span>
                      <p>Visits with <br> incomplete actions</p>
                      <a>View <i class="entypo--down-thin d-none d-lg-inline-block"></i></a>
                    </div>
                  </div>
                  <div class="col-6 col-md-3 text-center line-break pt-2 pt-md-0">
                    <div class="visit-actions-dashboard__visit-stat">
                      <span>6</span>
                      <p>Blank/Unfilled <br> Visit Reports</p>
                      <a>View <i class="entypo--down-thin d-none d-lg-inline-block"></i></a>
                    </div>
                  </div>
                  <div class="col-6 col-md-3 text-center line-break pt-2 pt-md-0">
                    <div class="visit-actions-dashboard__visit-stat">
                      <span class="entypo--search"></span>
                      <p>Keyword Search</p>
                      <p class="italic smaller d-none d-lg-block">Search all visit content inc. schools, comments, sections &amp; visit actions</p>
                      <a>Search <i class="entypo--right-thin d-none d-lg-inline-block"></i></a>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <!-- Table controls -->
          <div class="row">
            <div class="col-12">
              <div class="row no-gutters mb-4">
                <div class="col-12 col-lg-3 mb-3 mb-lg-0 pr-lg-3">
                  <select>
                    <option>All Visits</option>
                    <option>Longest Visits</option>
                    <option>Shortest Visits</option>
                    <option>Overdue Visits</option>
                    <option>Longest Admin Time</option>
                    <option>Blank/Incomplete Visits</option>
                    <option>Visits with Incomplete Actions</option>
                    <option>Draft Visits Visible to Schools</option>
                    <option>Finalised Visits Visible to Schools</option>
                    <option>Visits Hidden from Schools</option>
                  </select>
                </div>
                <div class="col-12 col-md-8 col-lg-4 col-xl-3 pr-md-3">
                  <div class="visit-actions-dashboard__search">
                    <input type="search" placeholder="Filter by (school, adviser, focus)" class="w-75">
                    <button aria-label="Clear search" class="visit-actions-dashboard__search-delete btn--default entypo--cancel"></button>
                  </div>
                </div>
                <button class="col-4 col-lg-1 mt-3 mt-md-0 btn btn--secondary--inverted ml-lg-auto">
                  <span class="entypo--export"></span> Export
                </button>
              </div>

              <!-- Table -->
              <div class="row">
                <div class="col-12">
                  <table class="sortable-table table box-shadow visit-actions-dashboard__table table--responsive">
                    <thead>
                      <tr>
                        <th><a>School</a></th>
                        <th><a>Adviser</a></th>
                        <th width="120"><a>Visit Date <span class="entypo--down-dir"></span></a></th>
                        <th width="110" class="text-lg-left"><a>Status</a></th>
                        <th width="150"><a>Focus</a></th>
                        <th width="150" class="text-lg-right">
                          <a>Visibility: ORG</a>
                          <span class="entypo--info-circled cursor--pointer brand--quaternary ml-1"></span>
                        </th>
                        <th width="120" class="text-lg-center">
                          <a>School</a>
                          <span class="entypo--info-circled cursor--pointer brand--quaternary"></span>
                        </th>
                        <th width="60" class="text-lg-center">Info</th>
                        <th width="100" class="text-lg-center">Options</th>
                      </tr>
                    </thead>
                    <tbody>
                      <tr v-for="(v, i) in visits" :key="i" class="obs-visit-table-row">

                        <!-- School -->
                        <td data-th="School">
                          <a href="#">{{ v.school }} ({{ v.urn }})</a>
                          <span v-if="v.extraSchools > 0" class="linked-schools">
                            <div class="entypo--school mr-1 d-flex align-items-center brand--quaternary"></div>
                            +{{ v.extraSchools }}
                          </span>
                        </td>

                        <!-- Adviser -->
                        <td data-th="Adviser">
                          {{ v.adviser }}
                          <span v-if="v.extraAdvisers > 0" class="advisors">
                            <div class="entypo--user mr-1"></div> +{{ v.extraAdvisers }}
                          </span>
                        </td>

                        <!-- Date -->
                        <td data-th="Visit Date">
                          <span :class="v.overdue ? 'is-overdue' : ''">
                            {{ v.date }}
                            <i v-if="v.overdue" class="entypo--flag"></i>
                          </span>
                        </td>

                        <!-- Status -->
                        <td data-th="Status">
                          <span :class="statusClass(v.status) + ' text-center d-lg-block'">{{ v.status }}</span>
                        </td>

                        <!-- Focus -->
                        <td data-th="Focus" class="force-break">{{ v.focus }}</td>

                        <!-- ORG Visibility -->
                        <td data-th="ORG Visibility" class="text-lg-right">
                          <div>
                            <span class="visibility-lozenge">
                              <div class="brand--quaternary-d10 px-2 d-flex" v-if="v.orgVisibility === 'private'">
                                <div class="entypo--lock mr-1"></div>
                                <span class="italic">Private</span>
                              </div>
                              <div class="brand--quaternary-d10 px-2 d-flex" v-else-if="v.orgVisibility === 'all'">
                                <span class="italic">All Users*</span>
                              </div>
                              <div class="brand--quaternary-d10 px-2 d-flex" v-else-if="v.orgVisibility === 'groups'">
                                <div class="d-flex"><div class="entypo--users-1 mr-1"></div>{{ v.orgGroups }}</div>
                                <div class="ml-2 d-flex"><div class="entypo--user mr-1"></div>{{ v.orgUsers }}</div>
                              </div>
                            </span>
                          </div>
                        </td>

                        <!-- School Visibility -->
                        <td data-th="School Visibility" class="text-lg-center">
                          <span v-if="v.schoolVisibility" class="d-inline-block pointer--cursor">
                            <span :class="'entypo--checkmark-circled delta pointer--cursors rag--' + v.schoolVisibility"></span>
                          </span>
                        </td>

                        <!-- Info -->
                        <td data-th="Info" class="text-lg-center">
                          <span class="d-inline-block">
                            <span class="entypo--info-circled"></span>
                          </span>
                        </td>

                        <!-- Options -->
                        <td data-th="Edit" class="text-left text-lg-center">
                          <span class="d-inline-block">
                            <a class="visit-options"><span class="entypo--dot-3"></span></a>
                          </span>
                        </td>

                      </tr>
                    </tbody>
                  </table>

                  <!-- Pagination -->
                  <div class="pagination-wrapper row">
                    <div class="col-12 col-lg-12 text-right">
                      <ol class="nav pagination v-pagination v-zeta">
                        <li class="pagination-item pagination__first flush--left"><a class="inactive">First</a></li>
                        <li class="pagination-item pagination__prev"><a class="inactive">Prev</a></li>
                        <li class="pagination-item"><a class="active inactive" aria-label="Go to page number 1">1</a></li>
                        <li class="pagination-item"><a aria-label="Go to page number 2">2</a></li>
                        <li class="pagination-item pagination__next"><a>Next</a></li>
                        <li class="pagination-item pagination__last"><a>Last</a></li>
                      </ol>
                    </div>
                  </div>

                </div>
              </div>
            </div>
          </div>

        </div>
      </div>
    </div>
  `,
});
