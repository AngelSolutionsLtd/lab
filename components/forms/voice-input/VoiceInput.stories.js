import VoiceInput from './VoiceInput.vue';

export default {
  title: 'Components/Forms/Voice Input/VoiceInput',
  component: VoiceInput,
  tags: ['autodocs'],
  argTypes: {
    id: {
      control: 'text',
      description: 'ID for the textarea element'
    },
    labelTitle: {
      control: 'text',
      description: 'Label text for the input'
    },
    value: {
      control: 'text',
      description: 'Current text value'
    },
    placeholder: {
      control: 'text',
      description: 'Placeholder text for the textarea'
    },
    disabled: {
      control: 'boolean',
      description: 'Disable the input and mic button'
    },
    maxLength: {
      control: 'number',
      description: 'Maximum character length (optional)'
    },
    language: {
      control: 'text',
      description: 'Language code for speech recognition (e.g., en-US, es-ES)'
    },
  },
};

const Template = (args) => ({
  components: { VoiceInput },
  data() {
    return {
      inputValue: args.value || '',
    };
  },
  watch: {
    'args.value'(newVal) {
      this.inputValue = newVal;
    },
  },
  setup() {
    return { args };
  },
  template: `
    <div class="form-fields" style="max-width: 500px">
      <VoiceInput
        v-bind="args"
        :value="inputValue"
        @input="inputValue = $event"
      />
    </div>
  `,
});

export const WebSpeechAPI = Template.bind({});
WebSpeechAPI.args = {
  id: 'voice-input-web-speech',
  labelTitle: 'AI Prompt',
  value: '',
  placeholder: 'Type or dictate your text here…',
  disabled: false,
  language: 'en-US',
};
WebSpeechAPI.parameters = {
  docs: {
    description: {
      story: 'Voice input powered by Web Speech API. Click the mic button to start dictating. Supported in Chrome, Edge, and Safari. The component will show a fallback textarea in unsupported browsers.',
    },
  },
};
