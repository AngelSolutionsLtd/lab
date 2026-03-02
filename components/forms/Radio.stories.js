import Radio from './Radio.vue';

export default {
  title: 'Components/Forms/Radio',
  component: Radio,
  argTypes: {
    modelValue: { control: { type: 'text' } },
    large: { control: { type: 'boolean' } }
  }
};

const Template = (args) => ({
  components: { Radio },
  setup() {
    return { args };
  },
  template: '<Radio v-model="args.modelValue" v-bind="args" />',
});

export const Default = Template.bind({});
Default.args = {
  id: 'radio1',
  label: 'Option 1',
  value: 'option1',
  modelValue: '',
  large: false
};

export const Selected = Template.bind({});
Selected.args = {
  id: 'radio2',
  label: 'Option 2',
  value: 'option2',
  modelValue: 'option2',
  large: false
};

export const RadioLarge = Template.bind({});
RadioLarge.args = {
  id: 'radioLarge1',
  label: 'Option 3',
  value: '1',
  modelValue: '',
  large: true
};
