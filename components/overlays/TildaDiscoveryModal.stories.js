import FeatureDiscoveryModal from './FeatureDiscoveryModal.vue';

export default {
  title: 'Components/Overlays/Tilda Discovery Modal',
  component: FeatureDiscoveryModal,
  tags: ['autodocs'],
  argTypes: {
    dismissBehavior: {
      control: 'select',
      options: ['none', 'session', 'temporary', 'permanent']
    },
    dismissDurationDays: { control: 'number' },
    onDismiss: { action: 'dismiss' },
    'onTour-start': { action: 'tour-start' },
    'onTour-complete': { action: 'tour-complete' },
    'onTour-step': { action: 'tour-step' }
  }
};

const tildaFeature = {
  icon: 'entypo--twinkle',
  accentGradient: 'linear-gradient(94deg, #40c9ff -74.46%, #e81cff 114.83%)',
  tourLayout: 'stacked',
  tourMaxWidth: '560px',
  ctaClass: 'btn--tilda',
  ctaIcon: 'entypo--twinkle',
  title: "Meet TILDA, Your New SEF Assistant",
  description: "TILDA helps you prepare for the 2025 Ofsted inspection framework — cutting the time you spend on drafting, formatting and restructuring your SEF.",
  benefits: [
    "Generate SEF sections from scratch using established Bite Size Questions.",
    "Upload your existing SEF and TILDA maps it to the right sections automatically.",
    "Your data stays secure — TILDA never shares your content with external AI models.",
  ],
  tourCta: "Show me how",
  tourSteps: [
    {
      title: "Upload & Autofill",
      points: [
        "Upload your existing SEF as a PDF or Word document.",
        "TILDA automatically maps your content to the correct sections of the 2025 Ofsted framework.",
        "Save hours of manual restructuring — your words, perfectly organised.",
      ]
    },
    {
      title: "Generate with Bite Size Questions",
      points: [
        "Not sure where to start? Use TILDA's guided Bite Size Questions to build each SEF section.",
        "Answer targeted prompts about your school and TILDA drafts the text for you.",
        "Each section is shaped around the language and priorities Ofsted inspectors look for.",
      ]
    },
    {
      title: "Refine & Elevate Your Writing",
      points: [
        "Already have content written? Paste it in and ask TILDA to refine it.",
        "TILDA aligns your text with the 2025 inspection framework without losing your voice.",
        "Use it as a writing partner — your expertise, sharper language.",
      ]
    },
    {
      title: "Collaborate with Your Team",
      points: [
        "Share SEF sections with colleagues for collaborative editing within Perspective.",
        "Link sections to your development plan and attach supporting evidence files.",
        "Version control keeps everyone working on the latest draft.",
      ]
    },
    {
      title: "Secure by Design",
      points: [
        "TILDA operates entirely within your existing Perspective environment.",
        "Your data is never sent to train external AI models.",
        "Full audit trail so you always know what was changed and by whom.",
      ]
    }
  ]
};

export const TildaDiscovery = (args) => ({
  components: { FeatureDiscoveryModal },
  data() {
    return { args, enabled: false };
  },
  methods: {
    showModal() {
      sessionStorage.removeItem(`featureDiscovery:${this.args.id}`);
      localStorage.removeItem(`featureDiscovery:${this.args.id}`);
      this.enabled = true;
    },
    hideModal() {
      this.enabled = false;
    }
  },
  template: `
    <div style="min-height: 400px; background: #f0f2f5; display: flex; align-items: center; justify-content: center; padding: 40px; border-radius: 8px;">
      <button @click="showModal" class="btn btn--tilda">
        <span class="entypo--twinkle mr-2"></span> Launch Tilda Discovery
      </button>

      <FeatureDiscoveryModal
        :id="args.id"
        :enabled="enabled"
        :feature="args.feature"
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

TildaDiscovery.args = {
  id: 'tilda-discovery',
  dismissBehavior: 'none',
  dismissDurationDays: 7,
  feature: tildaFeature
};
