import { defaultTerminology } from './terminology.js';

/**
 * Vuex stand-in for `registerGlobalFilters(app, store)`.
 *
 * Perspective's globalFilters.js reads exactly one thing off the store —
 * `store.getters.terminology` — so a plain object with that single getter is a
 * complete substitute. No Vuex install, no store module, no mutations.
 *
 * `terminology` is defined as a real getter rather than a fixed value because
 * `registerGlobalFilters` runs once, when the Vue app is created, but the
 * active set needs to change per story. Reading through the getter means every
 * `$filters.terminology()` call picks up whatever the current story asked for.
 */
let activeTerminology = defaultTerminology;

/**
 * Point the store at a terminology set. Falls back to the default set when
 * given nothing usable, which keeps `getTerminology` on its normal path rather
 * than its early-return-unchanged path.
 */
export const setActiveTerminology = (terminology) => {
  activeTerminology = Array.isArray(terminology) && terminology.length
    ? terminology
    : defaultTerminology;
};

export const terminologyStore = {
  getters: {
    get terminology() {
      return activeTerminology;
    },
  },
};
