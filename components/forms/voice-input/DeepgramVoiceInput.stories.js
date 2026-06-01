import { ref, onMounted } from 'vue';
import DeepgramVoiceInput from './DeepgramVoiceInput.vue';

export default {
  title: 'Components/Forms/Voice Input/DeepgramVoiceInput',
  component: DeepgramVoiceInput,
  tags: ['autodocs'],
  argTypes: {
    id: {
      control: 'text',
      description: 'ID for the textarea element',
    },
    modelValue: {
      control: 'text',
      description: 'Current text value (v-model)',
    },
    labelTitle: {
      control: 'text',
      description: 'Label text for the input',
    },
    placeholder: {
      control: 'text',
      description: 'Placeholder text for the textarea',
    },
    disabled: {
      control: 'boolean',
      description: 'Disable the input and mic button',
    },
    maxLength: {
      control: 'number',
      description: 'Maximum character length (optional)',
    },
    language: {
      control: 'select',
      options: ['en-US', 'en-GB', 'es-ES', 'fr-FR', 'de-DE', 'pt-BR', 'ja-JP'],
      description: 'Language code for speech recognition (Deepgram)',
    },
    tempKeyEndpoint: {
      control: 'text',
      description: 'Backend endpoint to fetch Deepgram temp key',
    },
    deepgramApiKey: {
      control: 'text',
      description: 'Direct Deepgram API key for testing (paste your key here to use live)',
    },
  },
};

const Template = (args) => ({
  components: { DeepgramVoiceInput },
  setup() {
    const modelValue = ref(args.modelValue || '');
    return { args, modelValue };
  },
  template: `
    <div class="form-fields" style="max-width: 500px">
      <DeepgramVoiceInput
        v-bind="args"
        v-model="modelValue"
      />
    </div>
  `,
});

export const Default = Template.bind({});
Default.args = {
  id: 'deepgram-voice-input-default',
  modelValue: '',
  labelTitle: 'AI Prompt',
  placeholder: 'Type or dictate…',
  disabled: false,
  maxLength: null,
  language: 'en-US',
  tempKeyEndpoint: '/api/deepgram/temp-key',
  deepgramApiKey: process.env.STORYBOOK_DEEPGRAM_API_KEY || '',
};
Default.parameters = {
  docs: {
    description: {
      story: 'Deepgram voice input with streaming speech recognition. Paste your Deepgram API key into the deepgramApiKey control, click the mic and start speaking. Real-time transcription streams from Deepgram.',
    },
  },
};
