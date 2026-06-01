import { ref } from 'vue';
import PlanningTargetCreation from './PlanningTargetCreation.vue';

const mockTeams = [
  { publicId: 'team-slt', name: 'Senior Leadership Team', nameWithCode: 'SLT - Senior Leadership Team', isSlt: true },
  { publicId: 'team-maths', name: 'Mathematics Department', nameWithCode: 'MA - Mathematics Department', isSlt: false },
  { publicId: 'team-english', name: 'English Department', nameWithCode: 'EN - English Department', isSlt: false },
  { publicId: 'team-science', name: 'Science Department', nameWithCode: 'SC - Science Department', isSlt: false },
];

export default {
  title: 'Components/AI/PlanningTargetCreation',
  component: PlanningTargetCreation,
  tags: ['autodocs'],
  argTypes: {
    open: { control: 'boolean' },
    defaultTeamId: {
      control: 'select',
      options: mockTeams.map(t => t.publicId),
    },
    voiceProvider: {
      control: 'select',
      options: ['none', 'deepgram', 'webspeech'],
      description: 'Voice input provider for the summary textarea',
    },
    deepgramApiKey: {
      control: 'text',
      description: 'Deepgram API key (only used when voiceProvider is "deepgram")',
    },
  },
};

const Template = (args) => ({
  components: { PlanningTargetCreation },
  setup() {
    const open = ref(args.open ?? true);
    return { args, open, mockTeams };
  },
  template: `
    <div>
      <button v-if="!open" class="btn btn--tilda" @click="open = true">
        Open Modal
      </button>
      <PlanningTargetCreation
        v-bind="args"
        :open="open"
        :teams="mockTeams"
        @close-modal="open = false"
        @add-new="(t) => { console.log('Target saved:', t); open = false; }"
        @create-manually="() => { console.log('Create manually'); open = false; }"
      />
    </div>
  `,
});

export const Default = Template.bind({});
Default.args = {
  open: true,
  defaultTeamId: 'team-slt',
  voiceProvider: 'none',
};
Default.parameters = {
  docs: {
    description: {
      story: 'Standard modal with plain textarea. Step 1: type a summary and click "Tilda: Generate". Step 2: review and edit before saving.',
    },
  },
};

export const WithDeepgramVoice = Template.bind({});
WithDeepgramVoice.args = {
  open: true,
  defaultTeamId: 'team-slt',
  voiceProvider: 'deepgram',
  deepgramApiKey: process.env.STORYBOOK_DEEPGRAM_API_KEY || '',
};
WithDeepgramVoice.parameters = {
  docs: {
    description: {
      story: 'Voice-enabled modal using Deepgram streaming speech recognition. Click the mic button to dictate your summary, then generate. Paste a Deepgram API key into the deepgramApiKey control to use live transcription.',
    },
  },
};

export const WithWebSpeechVoice = Template.bind({});
WithWebSpeechVoice.args = {
  open: true,
  defaultTeamId: 'team-slt',
  voiceProvider: 'webspeech',
};
WithWebSpeechVoice.parameters = {
  docs: {
    description: {
      story: 'Voice-enabled modal using the browser\'s built-in Web Speech API. No API key required. Best supported in Chrome and Edge.',
    },
  },
};

export const Closed = Template.bind({});
Closed.args = {
  open: false,
  defaultTeamId: 'team-slt',
  voiceProvider: 'none',
};
Closed.parameters = {
  docs: {
    description: {
      story: 'Modal in its closed state. Click "Open Modal" to launch it.',
    },
  },
};
