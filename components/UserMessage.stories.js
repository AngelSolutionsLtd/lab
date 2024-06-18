import UserMessage from './UserMessage.vue';

// More on how to set up stories at: https://storybook.js.org/docs/writing-stories
export default {
  title: 'Components/UserMessage',
  component: UserMessage,
  tags: ['autodocs'],
  render: (args, { argTypes }) => ({
    props: Object.keys(argTypes),
    components: { UserMessage },
    template: '<UserMessage v-bind="$props" />',
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
    body: {
        control: { type: 'text' },
    }
  },
};

// More on writing stories with args: https://storybook.js.org/docs/writing-stories/args
// export const positive = {
//   args: {
//     type: 'positive',
//     body: 'user message',
//     closable: true,
//     hasIcon: true
//   },
// };


const Template = (args, { argTypes }) => ({
    components: { UserMessage },
    props: Object.keys(argTypes),
    computed: {
      adjustedClosable() {
        return this.type === 'no-data' ? false : this.closable;
      }
    },
    template: '<UserMessage v-bind="$props" :closable="adjustedClosable" />',
  });
  
  export const PositiveMessage = Template.bind({});
  PositiveMessage.args = {
    type: 'positive',
    body: 'This is a positive message!',
    closable: true
  };
  
  export const InformationMessage = Template.bind({});
  InformationMessage.args = {
    type: 'information',
    body: 'This is an informational message.',
    closable: true
  };
  
  export const WarningMessage = Template.bind({});
  WarningMessage.args = {
    type: 'warning',
    body: 'This is a warning message.',
    closable: true
  };
  
  export const NegativeMessage = Template.bind({});
  NegativeMessage.args = {
    type: 'negative',
    body: 'This is a negative message!',
    closable: true
  };
  
  export const WhisperMessage = Template.bind({});
  WhisperMessage.args = {
    type: 'whisper',
    body: 'This is a whisper message.',
    closable: true
  };
  
  export const NoDataMessage = Template.bind({});
  NoDataMessage.args = {
    type: 'no-data',
    body: 'No data available.',
    closable: false // Explicitly setting this to false
  };
