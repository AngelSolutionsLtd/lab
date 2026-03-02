import FeedbackPopup from './FeedbackPopup.vue';

export default {
  title: 'Components/Overlays/Feedback Popup',
  component: FeedbackPopup,
  tags: ['autodocs'],
  argTypes: {
    // ─── Layout ────────────────────────────────────────────────────────────────
    ratingType: {
      control: 'select',
      options: ['stars', 'thumbs', 'none'],
      description: 'The style of rating input. `stars` shows a 5-star scale, `thumbs` shows up/down buttons, `none` shows just a text box.',
      table: { category: 'Layout', defaultValue: { summary: 'stars' } }
    },
    position: {
      control: 'select',
      options: ['bottom-right', 'bottom-left'],
      description: 'Corner of the screen where the popup appears.',
      table: { category: 'Layout', defaultValue: { summary: 'bottom-right' } }
    },

    // ─── Content ───────────────────────────────────────────────────────────────
    message: {
      control: 'text',
      description: 'The question or prompt shown at the top of the popup.',
      table: { category: 'Content', defaultValue: { summary: 'How are you finding Broadcast?' } }
    },
    thankYouMessage: {
      control: 'text',
      description: 'Message displayed after the user submits feedback.',
      table: { category: 'Content', defaultValue: { summary: 'Thanks for your feedback!' } }
    },
    textAreaPlaceholder: {
      control: 'text',
      description: 'Placeholder text inside the optional text area.',
      table: { category: 'Content', defaultValue: { summary: 'Tell us more (optional)...' } }
    },

    // ─── Options ───────────────────────────────────────────────────────────────
    showTextArea: {
      control: 'boolean',
      description: 'Show a text area for written feedback. When off with a rating type, submission happens immediately after the user rates.',
      table: { category: 'Options', defaultValue: { summary: true } }
    },

    // ─── Behaviour ─────────────────────────────────────────────────────────────
    enabled: {
      control: 'boolean',
      description: 'Whether the popup is active. Toggling this on will show the popup.',
      table: { category: 'Behaviour', defaultValue: { summary: true } }
    },
    id: {
      control: 'text',
      description: 'Unique identifier used as the storage key for dismissal state.',
      table: { category: 'Behaviour' }
    },
    'dismissal.strategy': {
      control: 'select',
      options: ['session', 'localStorage'],
      description: 'How dismissal is persisted — `session` resets on tab close, `localStorage` persists across sessions.',
      table: { category: 'Behaviour', defaultValue: { summary: 'session' } }
    },
    'dismissal.ttlHours': {
      control: 'number',
      description: 'Hours before a `localStorage` dismissal expires. Leave empty to dismiss permanently.',
      table: { category: 'Behaviour', defaultValue: { summary: 'null' } }
    },

    // ─── Events ────────────────────────────────────────────────────────────────
    onImpression: { action: 'impression', table: { category: 'Events' } },
    onRating: { action: 'rating', table: { category: 'Events' } },
    onFeedback: { action: 'feedback', table: { category: 'Events' } },
    onDismiss: { action: 'dismiss', table: { category: 'Events' } }
  }
};

// ─── Interactive Story ────────────────────────────────────────────────────────

const Template = (args) => ({
  components: { FeedbackPopup },
  data() {
    return {
      args,
      localEnabled: false
    };
  },
  watch: {
    // Allow the Storybook controls panel "enabled" toggle to open the popup
    'args.enabled'(newVal) {
      if (newVal) this.show();
      else this.localEnabled = false;
    }
  },
  methods: {
    show() {
      this.localEnabled = false;
      this.$nextTick(() => { this.localEnabled = true; });
    },
    hide() {
      this.localEnabled = false;
    }
  },
  template: `
    <div style="background: #f5f5f5; padding: 20px; min-height: 180px;">
      <div style="background: white; padding: 20px; border-radius: 8px; box-shadow: 0 2px 8px rgba(0,0,0,0.1); max-width: 380px;">
        <h3 style="margin: 0 0 6px; font-family: 'Open Sans', sans-serif; font-size: 15px; font-weight: 600; color: #1a1a1a;">
          Feedback Popup
        </h3>
        <p style="margin: 0 0 16px; font-family: 'Open Sans', sans-serif; font-size: 13px; color: #666;">
          Use the <strong>Controls</strong> panel to change the rating type, position, and content, then click <em>Show</em>.
        </p>
        <div style="display: flex; gap: 8px;">
          <button @click="show" class="btn btn--secondary" style="flex: 1;">
            Show Popup
          </button>
          <button @click="hide" class="btn btn--secondary--inverted" style="flex: 1;">
            Hide
          </button>
        </div>
      </div>

      <FeedbackPopup
        :id="args.id"
        :enabled="localEnabled"
        :message="args.message"
        :rating-type="args.ratingType"
        :show-text-area="args.showTextArea"
        :text-area-placeholder="args.textAreaPlaceholder"
        :thank-you-message="args.thankYouMessage"
        :position="args.position"
        :dismissal="args.dismissal"
        @impression="args.onImpression"
        @rating="args.onRating"
        @feedback="args.onFeedback"
        @dismiss="hide(); args.onDismiss()"
      />
    </div>
  `
});

// ─── Pre-configured Stories ───────────────────────────────────────────────────

// viewMode is 'story' on the individual canvas page, 'docs' on the docs page.
// We only auto-show the popup on the canvas page so the docs page stays clean.
const PreviewTemplate = (args, context, description) => ({
  components: { FeedbackPopup },
  data() {
    return {
      args,
      localEnabled: context.viewMode === 'story'
    };
  },
  methods: {
    show() {
      this.localEnabled = false;
      this.$nextTick(() => { this.localEnabled = true; });
    },
    hide() { this.localEnabled = false; }
  },
  template: `
    <div style="background: #f5f5f5; padding: 20px; min-height: 220px;">
      <div style="background: white; padding: 16px 20px; border-radius: 8px; box-shadow: 0 2px 8px rgba(0,0,0,0.1); max-width: 340px; display: flex; align-items: center; justify-content: space-between; gap: 16px;">
        <p style="margin: 0; font-family: 'Open Sans', sans-serif; font-size: 13px; color: #555; line-height: 1.5;">${description}</p>
        <button @click="show" class="btn btn--secondary" style="white-space: nowrap; flex-shrink: 0;">
          Show
        </button>
      </div>
      <FeedbackPopup
        v-bind="args"
        :enabled="localEnabled"
        @dismiss="hide"
      />
    </div>
  `
});

// Each story is a function (args, context) => component.
// We pass the fixed args and description as bound params, and forward context so
// PreviewTemplate can read context.viewMode to decide whether to auto-show.

export const StarRating = (args, context) => PreviewTemplate(
  {
    id: 'story-stars',
    message: 'How are you finding Broadcast?',
    ratingType: 'stars',
    showTextArea: true,
    textAreaPlaceholder: 'Tell us more (optional)...',
    thankYouMessage: 'Thanks for your feedback!',
    position: 'bottom-right',
    dismissal: { strategy: 'session', ttlHours: null }
  },
  context,
  'Default star rating — pick 1–5 stars then optionally add a comment before submitting.'
);
StarRating.storyName = 'Stars';
StarRating.parameters = {
  docs: { description: { story: 'The default variant. User picks a star rating, then optionally adds a written comment.' } }
};

export const ThumbsRating = (args, context) => PreviewTemplate(
  {
    id: 'story-thumbs',
    message: 'Was this feature helpful?',
    ratingType: 'thumbs',
    showTextArea: true,
    textAreaPlaceholder: "Anything you'd like to add?",
    thankYouMessage: 'Thanks, we appreciate it!',
    position: 'bottom-right',
    dismissal: { strategy: 'session', ttlHours: null }
  },
  context,
  'Thumbs up / down rating. Good for a simple helpful / not helpful check. Tapping a thumb opens the comment box.'
);
ThumbsRating.storyName = 'Thumbs';
ThumbsRating.parameters = {
  docs: { description: { story: 'Binary thumbs up/down rating. After tapping, the user can optionally add a written comment.' } }
};

export const ThumbsQuick = (args, context) => PreviewTemplate(
  {
    id: 'story-thumbs-quick',
    message: 'Did you find what you were looking for?',
    ratingType: 'thumbs',
    showTextArea: false,
    thankYouMessage: 'Got it — thanks!',
    position: 'bottom-right',
    dismissal: { strategy: 'session', ttlHours: null }
  },
  context,
  'One-tap thumbs — no text area. Tapping a thumb submits instantly and the popup closes after 2 seconds.'
);
ThumbsQuick.storyName = 'Thumbs (quick)';
ThumbsQuick.parameters = {
  docs: { description: { story: "Instant thumbs — `showTextArea` is off so tapping a thumb submits immediately with no extra step." } }
};

export const TellUsMore = (args, context) => PreviewTemplate(
  {
    id: 'story-text-only',
    message: 'Got a minute? Share your thoughts.',
    ratingType: 'none',
    showTextArea: true,
    textAreaPlaceholder: "What's on your mind?",
    thankYouMessage: 'Thanks for taking the time!',
    position: 'bottom-right',
    dismissal: { strategy: 'session', ttlHours: null }
  },
  context,
  'No rating at all — just a free-text box. Useful when you want open-ended comments without a score.'
);
TellUsMore.storyName = 'Text only';
TellUsMore.parameters = {
  docs: { description: { story: 'Skips the rating step entirely (`ratingType: "none"`). Goes straight to an open comment box.' } }
};

export const BottomLeft = (args, context) => PreviewTemplate(
  {
    id: 'story-bottom-left',
    message: 'How are you finding the new dashboard?',
    ratingType: 'stars',
    showTextArea: true,
    textAreaPlaceholder: 'Tell us more (optional)...',
    thankYouMessage: 'Thanks for your feedback!',
    position: 'bottom-left',
    dismissal: { strategy: 'session', ttlHours: null }
  },
  context,
  'Same star rating but anchored to the bottom-left corner — useful when the right side is occupied by other UI.'
);
BottomLeft.storyName = 'Bottom left';
BottomLeft.parameters = {
  docs: { description: { story: "Demonstrates the `bottom-left` position option." } }
};

// ─── Interactive (sandbox) ────────────────────────────────────────────────────

export const Interactive = Template.bind({});
Interactive.args = {
  id: 'feedback-popup-demo',
  message: 'How are you finding Broadcast?',
  ratingType: 'stars',
  showTextArea: true,
  textAreaPlaceholder: 'Tell us more (optional)...',
  thankYouMessage: 'Thanks for your feedback!',
  position: 'bottom-right',
  dismissal: {
    strategy: 'session',
    ttlHours: null
  }
};
Interactive.parameters = {
  docs: {
    description: {
      story: 'Use the **Controls** panel to switch between `stars`, `thumbs`, and `none` rating types, change the position, toggle the text area, and customise the message and thank-you text. Click **Show Popup** to preview. Check the **Actions** panel to inspect emitted events.'
    }
  }
};
