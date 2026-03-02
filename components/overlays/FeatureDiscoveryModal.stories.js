import FeatureDiscoveryModal from './FeatureDiscoveryModal.vue';

export default {
  title: 'Components/UX/FeatureDiscoveryModal',
  component: FeatureDiscoveryModal,
  tags: ['autodocs'],
  argTypes: {
    id: { control: 'text' },
    enabled: { control: 'boolean' },
    dismissBehavior: {
      control: 'select',
      options: ['none', 'session', 'temporary', 'permanent']
    },
    dismissDurationDays: { control: 'number' },
    // Events
    onDismiss: { action: 'dismiss' },
    'onTour-start': { action: 'tour-start' },
    'onTour-complete': { action: 'tour-complete' },
    'onTour-step': { action: 'tour-step' }
  }
};

// Sample feature data
const fileRequestsFeature = {
  icon: '📁',
  title: "Haven't tried File Requests yet?",
  description: "Get exactly what you need from parents and staff—no email attachments, no confusion. Just simple, organized file collection.",
  benefits: [
    "Collect consent forms, photos, and documents in one place",
    "Automatic reminders for parents who haven't uploaded",
    "Everything organized by student—no more searching through emails"
  ],
  tourCta: "Show me how it works",
  tourSteps: [
    {
      title: "Create a File Request",
      description: "Click 'New File Request' and choose what you need—consent forms, photos, medical documents, or anything else."
    },
    {
      title: "Choose Who to Request From",
      description: "Select specific parents, classes, or your whole school. You're in control of who sees the request."
    },
    {
      title: "Parents Upload Directly",
      description: "Parents get a notification and can upload files from their phone or computer. No email attachments needed!"
    },
    {
      title: "Track Progress in Real-Time",
      description: "See who's uploaded and who still needs to. Send automatic reminders with one click."
    }
  ]
};

const broadcastSchedulingFeature = {
  icon: '📅',
  title: "Schedule Your Messages",
  description: "Write messages now, send them later. Perfect for those late-night planning sessions when you want messages to go out during school hours.",
  benefits: [
    "Write messages anytime, schedule for the perfect time",
    "Never forget to send important reminders",
    "Respect parents' time—no notifications at midnight"
  ],
  tourCta: "Learn more",
  tourSteps: [
    {
      title: "Write Your Message",
      description: "Compose your message as usual. Everything works exactly the same way you're used to."
    },
    {
      title: "Click the Schedule Button",
      description: "Instead of 'Send Now', click the clock icon to schedule your message for later."
    },
    {
      title: "Pick Your Time",
      description: "Choose the perfect date and time. Your message will be sent automatically—even if you're not at your desk."
    }
  ]
};

const analyticsFeature = {
  icon: '📊',
  title: "See Who's Reading Your Messages",
  description: "Ever wonder if parents actually saw that important message? Now you can know for sure.",
  benefits: [
    "See exactly who opened your messages and when",
    "Identify parents who might have missed important updates",
    "Follow up with those who need a gentle reminder"
  ],
  tourCta: "Show me",
  tourSteps: [
    {
      title: "View Message Analytics",
      description: "Click on any sent message to see detailed read receipts and engagement stats."
    },
    {
      title: "See Read Status",
      description: "Green checks show who's read your message. Grey icons show who hasn't yet."
    },
    {
      title: "Send Targeted Follow-Ups",
      description: "Select parents who haven't read the message and send a quick follow-up reminder."
    }
  ]
};

const translationFeature = {
  icon: '🌍',
  title: "Automatic Translation for Families",
  description: "Reach every family in their preferred language. Your messages are automatically translated—no extra work for you.",
  benefits: [
    "Messages automatically translated to 50+ languages",
    "Parents choose their preferred language in settings",
    "Better engagement with multilingual families"
  ],
  tourCta: "See how it works",
  tourSteps: [
    {
      title: "Write in Your Language",
      description: "Just write your message in English (or whatever language you prefer). No need to do anything special."
    },
    {
      title: "Automatic Translation",
      description: "Broadcast automatically translates your message for parents who've set a different language preference."
    },
    {
      title: "Parents Read in Their Language",
      description: "Each parent sees your message in their chosen language. They can also switch between languages with one tap."
    }
  ]
};

// Template with trigger controls
const InteractiveTemplate = (args) => ({
  components: { FeatureDiscoveryModal },
  data() {
    return {
      args,
      enabled: false,
      selectedFeature: 'fileRequests',
      features: {
        fileRequests: fileRequestsFeature,
        scheduling: broadcastSchedulingFeature,
        analytics: analyticsFeature,
        translation: translationFeature
      }
    };
  },
  computed: {
    currentFeature() {
      return this.features[this.selectedFeature] || this.features.fileRequests;
    }
  },
  methods: {
    showModal() {
      // Clear any stored dismissals for demo purposes
      sessionStorage.removeItem(`featureDiscovery:${this.args.id}`);
      localStorage.removeItem(`featureDiscovery:${this.args.id}`);
      this.enabled = true;
    },
    hideModal() {
      this.enabled = false;
    }
  },
  template: `
    <div style="min-height: 400px; background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); padding: 40px; border-radius: 12px;">
      <div style="background: white; padding: 24px; border-radius: 12px; box-shadow: 0 4px 16px rgba(0,0,0,0.1); max-width: 500px; margin: 0 auto;">
        <h3 style="margin-top: 0; margin-bottom: 20px; font-family: 'Open Sans', sans-serif; font-size: 18px; color: #1a1a1a;">
          Feature Discovery Modal Demo
        </h3>

        <div style="margin-bottom: 20px;">
          <label style="display: block; margin-bottom: 8px; font-family: 'Open Sans', sans-serif; font-size: 14px; font-weight: 600; color: #4a4a4a;">
            Choose a Feature to Showcase:
          </label>
          <select
            v-model="selectedFeature"
            style="width: 100%; padding: 10px 12px; border: 1px solid #d0d0d0; border-radius: 8px; font-family: 'Open Sans', sans-serif; font-size: 14px; color: #1a1a1a; background: white; cursor: pointer;"
          >
            <option value="fileRequests">📁 File Requests (New Feature)</option>
            <option value="scheduling">📅 Message Scheduling</option>
            <option value="analytics">📊 Message Analytics</option>
            <option value="translation">🌍 Automatic Translation</option>
          </select>
        </div>

        <div style="margin-bottom: 20px; padding: 16px; background: #f8f9fa; border-radius: 8px; border-left: 4px solid #667eea;">
          <p style="margin: 0; font-family: 'Open Sans', sans-serif; font-size: 13px; color: #4a4a4a; line-height: 1.5;">
            <strong>💡 Tip:</strong> This modal intelligently detects when users haven't tried a feature and nudges them with helpful context and a guided tour.
          </p>
        </div>

        <button @click="showModal" class="btn btn--primary" style="width: 100%; padding: 14px;">
          Show Feature Discovery
        </button>
      </div>

      <FeatureDiscoveryModal
        :id="args.id"
        :enabled="enabled"
        :feature="currentFeature"
        :dismiss-behavior="args.dismissBehavior"
        :dismiss-duration-days="args.dismissDurationDays"
        @dismiss="hideModal(); args.onDismiss($event)"
        @tour-start="args['onTour-start']($event)"
        @tour-complete="args['onTour-complete']($event)"
        @tour-step="args['onTour-step']($event)"
      />
    </div>
  `
});

// Stories
export const FileRequests = InteractiveTemplate.bind({});
FileRequests.args = {
  id: 'file-requests-discovery',
  dismissBehavior: 'temporary',
  dismissDurationDays: 7
};
FileRequests.parameters = {
  docs: {
    description: {
      story: 'Clever nudge for the File Requests feature. Shows when a user hasn\'t tried the feature, with benefits and a guided tour. Dismissal is temporary (7 days by default).'
    }
  }
};

export const MessageScheduling = InteractiveTemplate.bind({});
MessageScheduling.args = {
  id: 'scheduling-discovery',
  dismissBehavior: 'session',
  dismissDurationDays: 7
};
MessageScheduling.storyName = 'Message Scheduling';
MessageScheduling.parameters = {
  docs: {
    description: {
      story: 'Feature discovery for message scheduling. Perfect for showing users they can write messages now and send them during appropriate hours.'
    }
  }
};

// Simple template without controls (for quick preview)
const SimpleTemplate = (args) => ({
  components: { FeatureDiscoveryModal },
  setup() {
    return { args };
  },
  template: `
    <div style="min-height: 400px;">
      <FeatureDiscoveryModal
        v-bind="args"
        @dismiss="args.onDismiss"
        @tour-start="args['onTour-start']"
        @tour-complete="args['onTour-complete']"
        @tour-step="args['onTour-step']"
      />
    </div>
  `
});

export const AlwaysVisible = SimpleTemplate.bind({});
AlwaysVisible.args = {
  id: 'always-visible',
  enabled: true,
  dismissBehavior: 'none',
  feature: fileRequestsFeature
};
AlwaysVisible.parameters = {
  docs: {
    description: {
      story: 'Modal that is always visible (dismissBehavior: "none"). Useful for testing and development.'
    }
  }
};

export const SessionDismissal = SimpleTemplate.bind({});
SessionDismissal.args = {
  id: 'session-dismissal',
  enabled: true,
  dismissBehavior: 'session',
  feature: analyticsFeature
};
SessionDismissal.parameters = {
  docs: {
    description: {
      story: 'Dismissed for the current session only. Once dismissed, won\'t show again until the user refreshes or starts a new session.'
    }
  }
};

export const PermanentDismissal = SimpleTemplate.bind({});
PermanentDismissal.args = {
  id: 'permanent-dismissal',
  enabled: true,
  dismissBehavior: 'permanent',
  feature: translationFeature
};
PermanentDismissal.parameters = {
  docs: {
    description: {
      story: 'Permanently dismissed once closed. Won\'t show again unless localStorage is cleared.'
    }
  }
};

// Playground story for customization
export const CustomFeature = InteractiveTemplate.bind({});
CustomFeature.args = {
  id: 'custom-feature',
  dismissBehavior: 'temporary',
  dismissDurationDays: 3
};
CustomFeature.parameters = {
  docs: {
    description: {
      story: 'Interactive playground to test different features and settings. Select from the dropdown, modify the controls, and click "Show Feature Discovery" to see it in action. Check the Actions panel to see emitted events.'
    }
  }
};
