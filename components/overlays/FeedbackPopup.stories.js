import FeatureNudge from './FeatureNudge.vue';

export default {
  title: 'Components/UX/FeatureNudge',
  component: FeatureNudge,
  tags: ['autodocs'],
  argTypes: {
    id: { control: 'text' },
    enabled: { control: 'boolean' },
    message: { control: 'text' },
    position: {
      control: 'select',
      options: ['bottom-right', 'bottom-left']
    },
    'dismissal.strategy': {
      control: 'select',
      options: ['session', 'localStorage']
    },
    'dismissal.ttlHours': {
      control: 'number'
    },
    // Events
    onImpression: { action: 'impression' },
    onRating: { action: 'rating' },
    onFeedback: { action: 'feedback' },
    onDismiss: { action: 'dismiss' }
  }
};

// Template for stories with interactive trigger
const Template = (args) => ({
  components: { FeatureNudge },
  data() {
    return {
      args,
      enabled: false,
      selectedPreset: 'default',
      presets: {
        default: {
          message: 'How are you finding Broadcast?',
          position: 'bottom-right'
        },
        customFeature: {
          message: 'Rate your experience with our new file requests feature',
          position: 'bottom-right'
        },
        bottomLeft: {
          message: 'How are you finding Broadcast?',
          position: 'bottom-left'
        },
        shortMessage: {
          message: 'Quick feedback: How would you rate us?',
          position: 'bottom-right'
        }
      }
    };
  },
  computed: {
    currentPreset() {
      return this.presets[this.selectedPreset] || this.presets.default;
    }
  },
  methods: {
    showNudge() {
      this.enabled = true;
    },
    hideNudge() {
      this.enabled = false;
    }
  },
  template: `
    <div style="background: #f5f5f5; padding: 20px;">
      <div style="background: white; padding: 20px; border-radius: 8px; box-shadow: 0 2px 8px rgba(0,0,0,0.1); max-width: 400px;">
        <h3 style="margin-top: 0; margin-bottom: 16px; font-family: 'Open Sans', sans-serif; font-size: 16px; color: #1a1a1a;">Feature Feedback Nudge</h3>

        <div style="margin-bottom: 12px;">
          <label style="display: block; margin-bottom: 6px; font-family: 'Open Sans', sans-serif; font-size: 13px; font-weight: 600; color: #4a4a4a;">
            Select Preset:
          </label>
          <select
            v-model="selectedPreset"
            style="width: 100%; padding: 8px 10px; border: 1px solid #d0d0d0; border-radius: 6px; font-family: 'Open Sans', sans-serif; font-size: 13px; color: #1a1a1a; background: white; cursor: pointer;"
          >
            <option value="default">Default - Bottom Right</option>
            <option value="customFeature">Custom Feature Message</option>
            <option value="bottomLeft">Bottom Left Position</option>
            <option value="shortMessage">Short Message</option>
          </select>
        </div>

        <div style="display: flex; gap: 8px;">
          <button @click="showNudge" class="btn btn--secondary" style="flex: 1;">
            Show Nudge
          </button>
          <button @click="hideNudge" class="btn btn--secondary--inverted" style="flex: 1;">
            Hide Nudge
          </button>
        </div>
      </div>

      <FeatureNudge
        :id="args.id"
        :enabled="enabled"
        :message="currentPreset.message"
        :position="currentPreset.position"
        :dismissal="args.dismissal"
        @impression="args.onImpression"
        @rating="args.onRating"
        @feedback="args.onFeedback"
        @dismiss="hideNudge(); args.onDismiss()"
      />
    </div>
  `
});

// Default story with interactive controls
export const Interactive = Template.bind({});
Interactive.args = {
  id: 'feedback-nudge-interactive',
  dismissal: {
    strategy: 'session',
    ttlHours: null
  }
};
Interactive.parameters = {
  docs: {
    description: {
      story: 'Interactive demo with dropdown presets and trigger buttons. Select a preset from the dropdown and click "Show Nudge" to see it in action. Check the Actions panel to see emitted events.'
    }
  }
};
