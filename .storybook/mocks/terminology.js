/**
 * Mock terminology data for Storybook.
 *
 * In production these pairs come from the server and land in Vuex as
 * `store.getters.terminology`. Here we hard-code two sets so stories can render
 * production components without a back end.
 *
 * The token list mirrors `App_Vue/static/terminology.json` in the Perspective
 * repo. It does not have to stay exhaustive: `getTerminology` leaves any token
 * it cannot find untouched, so an unknown token renders as-is rather than
 * throwing or blanking out.
 *
 * Token conventions:
 *   - capitalised and lowercase are separate tokens  -> {#Target$} / {#target$}
 *   - plurals are a space then `s` before the close  -> {#target s$}
 *   - compound words are camelCase                   -> {#developmentPlan$}
 */

/**
 * Authoring shortcut: a token -> replacement map is far easier to keep in sync
 * across the two sets than 45 hand-written object literals. The exported value
 * is the `[{ original, replacement }]` array that production code expects.
 */
const toTerminology = (map) =>
  Object.entries(map).map(([original, replacement]) => ({ original, replacement }));

/** Out-of-the-box wording: every token maps to its natural word. */
export const defaultTerminology = toTerminology({
  '{#Action$}': 'Action',
  '{#Action s$}': 'Actions',
  '{#action$}': 'action',
  '{#action s$}': 'actions',

  '{#Cpdneed$}': 'CPD Need',
  '{#Cpdneed s$}': 'CPD Needs',
  '{#cpdneed$}': 'CPD need',
  '{#cpdneed s$}': 'CPD needs',

  '{#Description$}': 'Description',
  '{#description$}': 'description',

  '{#DevelopmentPlan$}': 'Development Plan',
  '{#DevelopmentPlan s$}': 'Development Plans',
  '{#developmentPlan$}': 'development plan',

  '{#Evaluation$}': 'Evaluation',

  '{#Monitor$}': 'Monitor',
  '{#monitor$}': 'monitor',

  '{#Performance$}': 'Performance',

  '{#Personal$}': 'Personal',
  '{#personal$}': 'personal',

  '{#Plan$}': 'Plan',
  '{#Plan s$}': 'Plans',
  '{#plan$}': 'plan',
  '{#plan s$}': 'plans',

  '{#Responsible$}': 'Responsible',
  '{#responsible$}': 'responsible',

  '{#Review$}': 'Review',
  '{#Review s$}': 'Reviews',
  '{#review$}': 'review',
  '{#review s$}': 'reviews',

  '{#Reviewee$}': 'Reviewee',
  '{#Reviewee s$}': 'Reviewees',
  '{#reviewee$}': 'reviewee',
  '{#reviewee s$}': 'reviewees',

  '{#Reviewer$}': 'Reviewer',
  '{#Reviewer s$}': 'Reviewers',
  '{#reviewer$}': 'reviewer',
  '{#reviewer s$}': 'reviewers',

  '{#Strategy$}': 'Strategy',
  '{#strategy$}': 'strategy',

  '{#SuccessCriteria$}': 'Success Criteria',
  '{#successCriteria$}': 'success criteria',

  '{#Target$}': 'Target',
  '{#Target s$}': 'Targets',
  '{#target$}': 'target',
  '{#target s$}': 'targets',
});

/**
 * A school that has renamed things, so stories can show substitution actually
 * happening rather than a no-op. Same tokens, appraisal-flavoured wording.
 */
export const customisedTerminology = toTerminology({
  '{#Action$}': 'Task',
  '{#Action s$}': 'Tasks',
  '{#action$}': 'task',
  '{#action s$}': 'tasks',

  '{#Cpdneed$}': 'Training Need',
  '{#Cpdneed s$}': 'Training Needs',
  '{#cpdneed$}': 'training need',
  '{#cpdneed s$}': 'training needs',

  '{#Description$}': 'Summary',
  '{#description$}': 'summary',

  '{#DevelopmentPlan$}': 'Improvement Plan',
  '{#DevelopmentPlan s$}': 'Improvement Plans',
  '{#developmentPlan$}': 'improvement plan',

  '{#Evaluation$}': 'Assessment',

  '{#Monitor$}': 'Track',
  '{#monitor$}': 'track',

  '{#Performance$}': 'Growth',

  '{#Personal$}': 'Individual',
  '{#personal$}': 'individual',

  '{#Plan$}': 'Programme',
  '{#Plan s$}': 'Programmes',
  '{#plan$}': 'programme',
  '{#plan s$}': 'programmes',

  '{#Responsible$}': 'Accountable',
  '{#responsible$}': 'accountable',

  '{#Review$}': 'Appraisal',
  '{#Review s$}': 'Appraisals',
  '{#review$}': 'appraisal',
  '{#review s$}': 'appraisals',

  '{#Reviewee$}': 'Appraisee',
  '{#Reviewee s$}': 'Appraisees',
  '{#reviewee$}': 'appraisee',
  '{#reviewee s$}': 'appraisees',

  '{#Reviewer$}': 'Line Manager',
  '{#Reviewer s$}': 'Line Managers',
  '{#reviewer$}': 'line manager',
  '{#reviewer s$}': 'line managers',

  '{#Strategy$}': 'Approach',
  '{#strategy$}': 'approach',

  '{#SuccessCriteria$}': 'Impact Measures',
  '{#successCriteria$}': 'impact measures',

  '{#Target$}': 'Objective',
  '{#Target s$}': 'Objectives',
  '{#target$}': 'objective',
  '{#target s$}': 'objectives',
});
