import { setup } from '@storybook/vue3';
import registerGlobalFilters from '../Modules/Filters/globalFilters.js';
import { defaultTerminology, customisedTerminology } from './mocks/terminology.js';
import { terminologyStore, setActiveTerminology } from './mocks/terminologyStore.js';
import { createRouter, createWebHashHistory } from 'vue-router';

const router = createRouter({
    history: createWebHashHistory(),
    routes: [
    {
      path: '/docs/components-navigation-breadcrumbnav--docs/analysis',
      name: 'Analysis',
      component: { template: '<div />' },
      meta: { breadcrumb: { subdirectory: 'Analysis' } },
    },
    {
      path: '/docs/components-navigation-breadcrumbnav--docs',
      name: 'DevelopmentFeedback',
      component: { template: '<div />' },
      meta: { breadcrumb: { subdirectory: 'Development Feedback' } },
    },
  ],
});

/**
 * Production components call `$filters.terminology(...)` and would throw here
 * without it, so rather than changing the components we mimic the environment:
 * the real `registerGlobalFilters` from Perspective, handed a stand-in store.
 *
 * This also brings the date filters along for free — `formatDateTime`,
 * `formatDateFullYear`, `formatDate2Year`, `formatTime` and `formatDateToString`
 * are all available to stories on `$filters`.
 */
setup((app) => {
  app.use(router);
  registerGlobalFilters(app, terminologyStore);
});

/** Named sets a story can ask for by string via `parameters.terminology`. */
const terminologySets = {
  default: defaultTerminology,
  customised: customisedTerminology,
};

/** @type { import('@storybook/vue3').Preview } */
const preview = {
  parameters: {
    controls: {
      matchers: {
        color: /(background|color)$/i,
        date: /Date$/i,
      },
    },
    /**
     * Which terminology a story renders with. Accepts:
     *   'default'     - out-of-the-box wording (the default)
     *   'customised'  - a school that has renamed things
     *   [{ original, replacement }] - a bespoke set defined in the story
     */
    terminology: 'default',
  },
  decorators: [
    (story, context) => {
      const requested = context.parameters.terminology;
      setActiveTerminology(
        Array.isArray(requested) ? requested : terminologySets[requested],
      );
      return story();
    },
  ],
};

export default preview;
export { router };
