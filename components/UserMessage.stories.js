import UserMessage from './UserMessage.vue';

// More on how to set up stories at: https://storybook.js.org/docs/writing-stories
export default {
  title: 'Components/UserMessage',
  component: UserMessage,
  tags: ['autodocs'],
  render: (args, { argTypes }) => ({
    props: Object.keys(argTypes),
    components: { UserMessage },
    template: `
      <UserMessage v-bind="filteredProps">
        ${args.slotTemplate}
      </UserMessage>
    `,
    computed: {
      filteredProps() {
        const { slotTemplate, ...props } = this.$props;
        return props;
      },
    },
  }),
  argTypes: {
    type: { 
        control: { type: 'select' },
        options: ['positive','information','warning', 'negative', 'whisper', 'no-data']
    },
    parentClass: {
        control: { type: 'text' },
        description: 'sets class on body wrapper'
    },
    closable: {
        control: 'boolean' 
    },
    background: {
        control: { type: 'text' },
        description: 'sets class on user-message wrapper'
    },
    hasIcon: {
        control: 'boolean'
    },
  },
};

const Template = (args, { argTypes }) => ({
  props: Object.keys(argTypes),
  components: { UserMessage },
  template: `
    <UserMessage v-bind="filteredProps">
      ${args.slotTemplate}
    </UserMessage>
  `,
  computed: {
    filteredProps() {
      const { slotTemplate, ...props } = this.$props;
      return props;
    },
  },
});

export const PositiveMessage = Template.bind({});
PositiveMessage.args = {
  type: 'positive',
  slotTemplate: 'This is additional positive message content!',
  closable: true
};

export const InformationMessage = Template.bind({});
InformationMessage.args = {
  type: 'information',
  slotTemplate: 'This is additional informational message content.',
  closable: true
};

export const WarningMessage = Template.bind({});
WarningMessage.args = {
  type: 'warning',
  slotTemplate: 'This is additional warning message content.',
  closable: true
};

export const NegativeMessage = Template.bind({});
NegativeMessage.args = {
  type: 'negative',
  slotTemplate: 'This is additional negative message content!',
  closable: true
};

export const WhisperMessage = Template.bind({});
WhisperMessage.args = {
  type: 'whisper',
  slotTemplate: 'This is additional whisper message content.',
  closable: true
};

export const NoDataMessage = Template.bind({});
NoDataMessage.args = {
  type: 'no-data',
  slotTemplate: 'No additional data available.',
  closable: false // Explicitly setting this to false
};
