import ToggleSwitch from './ToggleSwitch.vue';

export default {
    title: 'Components/ToggleSwitch',
    component: ToggleSwitch,
    tags: ['autodocs'],
    argTypes: {
      value: { control: 'boolean' },
      onText: { control: 'text' },
      offText: { control: 'text' },
      reset: { control: 'number' },
    },
  };
  
  const Template = (args, { argTypes }) => ({
    props: Object.keys(argTypes),
    components: { ToggleSwitch },
    template: '<ToggleSwitch v-bind="$props" />',
  });
  
  export const Default = Template.bind({});
  Default.args = {
    value: false,
    onText: 'ON',
    offText: 'OFF',
    reset: 0
  };