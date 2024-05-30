import Heading from './Heading.vue';

// Export metadata for the component
export default {
title: 'Example/Heading',
  component: Heading,
};

// Export named functions for each story
export const Default = () => ({
  components: { Heading },
  template: '<Heading text="Hello, World!" />',
});

export const CustomText = () => ({
  components: { Heading },
  template: '<Heading text="Custom Heading" />',
});
