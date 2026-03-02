// .storybook/Checkbox.stories.js

import Checkbox from './Checkbox.vue';

export default {
  title: 'Components/Forms/Checkbox',
  component: Checkbox,
};

const Template = (args, { argTypes }) => ({
  components: { Checkbox },
  props: Object.keys(argTypes),
  template: '<Checkbox v-bind="$props" />',
});

export const Default = Template.bind({});
Default.args = {
  value: true,
  complete: false,
  small: false,
};

export const Incomplete = Template.bind({});
Incomplete.args = {
  ...Default.args,
  complete: false,
};

export const SmallCheckbox = Template.bind({});
SmallCheckbox.args = {
  ...Default.args,
  small: true,
};

export const DisabledCheckbox = Template.bind({});
DisabledCheckbox.args = {
  ...Default.args,
  value: false,
};

