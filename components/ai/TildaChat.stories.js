import TildaChat from './TildaChat.vue';

export default {
  title: 'Components/Ai/Tilda Chat',
  component: TildaChat,
  tags: ['autodocs'],
  argTypes: {
    insights: { control: 'object' },
  },
  parameters: {
    layout: 'fullscreen',
    docs: {
      description: {
        component:
          'A floating trigger button that opens a side drawer AI chat interface. Click "Ask Tilda" in the bottom-right corner to open it. Prototype uses simulated responses.',
      },
    },
  },
};

const Template = (args) => ({
  components: { TildaChat },
  setup() {
    return { args };
  },
  template: `
    <div style="min-height: 100vh; background: #f5f4f8; font-family: 'Open Sans', sans-serif;">
      <TildaChat v-bind="args" />
    </div>
  `,
});

export const Default = Template.bind({});
Default.args = {};

export const CustomInsights = Template.bind({});
CustomInsights.storyName = 'Custom Insights';
CustomInsights.args = {
  insights: [
    {
      title: 'Attendance data stands out',
      body: 'Persistent absence is above the national average — likely to be a focus area.',
      response: {
        summary: 'Persistent absence is your most significant risk area.',
        body: 'Your attendance figures are above the national average for persistent absence, which is a known priority for inspectors. The data needs to be addressed in your SEF with a clear narrative around causes and the steps you\'re taking.',
        stat: { value: '18%', label: 'Persistent absence rate' },
        points: [
          'National average is currently 14.3% — you are above this',
          'Targeted support plans need referencing in your narrative',
          'Attendance recovery actions should be evidenced and dated',
        ],
      },
    },
    {
      title: 'Leadership narrative is strong',
      body: 'Well-evidenced and uses the right framework language throughout.',
      response: {
        summary: 'Your Leadership & Management section is one of your strongest.',
        body: 'The narrative is coherent, well-structured, and references the right inspection criteria. Evidence is specific and recent. There\'s very little to change here — focus your energy on the weaker sections.',
        points: [
          'Self-evaluation is sharp and honest',
          'Governance section is particularly well-evidenced',
          'Consider adding a reference to your development plan timeline',
        ],
      },
    },
    {
      title: 'Curriculum sequencing needs attention',
      body: 'Several subjects lack a rationale for how knowledge builds year on year.',
      response: {
        summary: 'Curriculum sequencing is a visible gap in several subject areas.',
        body: 'Inspectors will want to see a clear rationale for how knowledge and skills build progressively across year groups. Currently several subjects reference coverage but not sequencing — this is a distinction inspectors are trained to spot.',
        points: [
          'Maths and Science have no sequencing rationale',
          'English sequencing is present but needs updating for Y7-9',
          'Consider using the subject lead template to structure this quickly',
        ],
      },
    },
  ],
};
