import FeatureDiscoveryModal from './FeatureDiscoveryModal.vue';

export default {
  title: 'Components/Overlays/Feature Discovery Modal',
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

const fileRequestsFeature = {
  icon: 'entypo--folder',
  title: "Automate Your File Management",
  description: "Collect, manage and track files from your schools — all in one place, without the inbox chaos.",
  benefits: [
    "Issue requests with deadlines to specific schools, phases and roles.",
    "Search, filter and bulk-download everything returned to you.",
    "Reject files individually or in bulk, with optional reasons.",
  ],
  tourMaxWidth: '1200px',
  tourCta: "Show me how it works",
  tourSteps: [
    {
      title: "Create a File Request",
      points: [
        "Issue file requests with specified deadlines to set roles within selected schools based on Nexus groups, school phases and more.",
        "Export a summary of your file collection details for your own analysis.",
        "Effortlessly manage, search, filter and download all files, including comments, returned by your schools.",
      ],
      image: "/images/file-requests-1.gif"
    },
    {
      title: "Manage & Download Files",
      points: [
        "Expand your collection capability to include files from other establishments including Early Years settings.",
        "Reject single or multiple files, either pre or post-download, with the option to add your reasons for rejection.",
        "Maintain optimal control with the ability to update school lists, pause a collection, and access a detailed audit trail.",
      ],
      image: "/images/file-requests-2.gif"
    }
  ]
};

export const FileRequests = (args) => ({
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
      <button @click="showModal" class="btn btn--secondary">
        Launch File Requests Discovery
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

FileRequests.args = {
  id: 'file-requests-discovery',
  dismissBehavior: 'none',
  dismissDurationDays: 7,
  feature: fileRequestsFeature
};
