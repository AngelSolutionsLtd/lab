/**
 * Demonstrates the mocked terminology system.
 *
 * Perspective lets schools rename domain nouns. Components embed tokens like
 * `{#Reviewer$}` in their strings and the global `$filters.terminology` filter
 * swaps them for the school's wording at render time. Storybook mimics that
 * environment (see .storybook/preview.js) so production components run here
 * unmodified.
 */

const TerminologyDemo = {
  name: 'TerminologyDemo',
  props: {
    samples: {
      type: Array,
      required: true,
    },
  },
  template: `
    <div style="display:flex; flex-direction:column; gap:12px; font-family:system-ui, sans-serif;">
      <div
        v-for="(sample, index) in samples"
        :key="index"
        style="border:1px solid #EAECED; border-radius:6px; padding:12px 16px;"
      >
        <code style="display:block; color:#7A8A99; font-size:12px; margin-bottom:6px;">{{ sample }}</code>
        <p style="margin:0; font-size:15px; color:#2C3E4F;">{{ $filters.terminology(sample) }}</p>
      </div>
    </div>
  `,
};

const samples = [
  'Add a new {#Target$}',
  'Each {#Reviewer$} agrees {#target s$} with their {#Reviewee$} before the {#Review$} begins.',
  '{#Reviewer s$} can {#monitor$} progress against the {#DevelopmentPlan$} and log {#Cpdneed s$}.',
  'This {#target$} has no {#successCriteria$} yet — add a {#description$} and say who is {#responsible$}.',
];

export default {
  title: 'Design/Terminology',
  component: TerminologyDemo,
  tags: ['autodocs'],
  parameters: {
    docs: {
      description: {
        component:
          'Each row shows the raw string a component contains, then the same string ' +
          'after `$filters.terminology` has run. Set `parameters.terminology` on a ' +
          "story to `'default'`, `'customised'`, or your own array of " +
          '`{ original, replacement }` pairs.',
      },
    },
  },
  argTypes: {
    samples: {
      control: 'object',
      description: 'Strings containing terminology tokens',
    },
  },
};

const Template = (args) => ({
  components: { TerminologyDemo },
  setup() {
    return { args };
  },
  template: '<TerminologyDemo :samples="args.samples" />',
});

/** Out-of-the-box wording — every token resolves to its natural word. */
export const Default = Template.bind({});
Default.args = { samples };

/** A school that has renamed things: Reviewer becomes Line Manager, and so on. */
export const Customised = Template.bind({});
Customised.args = { samples };
Customised.parameters = { terminology: 'customised' };

/**
 * Tokens the mock data does not know about are left exactly as they are, which
 * is the production behaviour — it means the mock list never has to be complete.
 */
export const UnknownTokensPassThrough = Template.bind({});
UnknownTokensPassThrough.args = {
  samples: [
    'The {#Reviewer$} signs off, then the {#Governor$} is notified.',
    '{#Trustee s$} cannot edit a {#target$}.',
  ],
};

/** A story can also supply its own pairs instead of naming a set. */
export const BespokeSet = Template.bind({});
BespokeSet.args = { samples: ['Each {#Reviewer$} agrees {#target s$} with their {#Reviewee$}.'] };
BespokeSet.parameters = {
  terminology: [
    { original: '{#Reviewer$}', replacement: 'Mentor' },
    { original: '{#Reviewee$}', replacement: 'Mentee' },
    { original: '{#target s$}', replacement: 'goals' },
  ],
};
