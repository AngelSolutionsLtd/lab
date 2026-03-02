import SkeletonLoader from './SkeletonLoader.vue';

export default {
  title: 'Components/SkeletonLoader',
  component: SkeletonLoader,
  tags: ['autodocs'],
  argTypes: {
    minHeight: {
      control: 'text',
      description: 'Sets the minimum height of the skeleton loader',
      defaultValue: '50px',
    },
    width: {
      control: 'text',
      description: 'Sets the width of the skeleton loader',
      defaultValue: '100%',
    },
    darkMode: {
      control: 'boolean',
      description: 'Toggles dark mode',
      defaultValue: false,
    },
  },
};

const Template = (args) => ({
  components: { SkeletonLoader },
  setup() {
    return { args };
  },
  template: `
   <SkeletonLoader v-bind="args" :width="args.width" :minHeight="args.minHeight" :darkMode="args.darkMode" />
  `,
});

export const Loader = Template.bind({});
Loader.args = {
  minHeight: '50px',
  width: '100%',
  darkMode: false,
};

export const LoaderDarkMode = Template.bind({});
LoaderDarkMode.args = {
  minHeight: '50px',
  width: '100%',
  darkMode: true,
};
