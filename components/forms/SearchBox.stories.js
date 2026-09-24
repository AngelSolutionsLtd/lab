import SearchBox from './SearchBox.vue';

export default {
  title: 'Components/Forms/SearchBox',
  component: SearchBox,
  tags: ['autodocs'],
  argTypes: {
    modelValue: { control: 'string', description: 'Value of input'},
    placeholder: { control: 'string', description: 'Placeholder text for input'},
  }, 
};

const Template = (args) => ({
  components: { SearchBox },
  setup() {
      return { args };
  },
  template: '<div style="max-width: 300px"><SearchBox v-bind="args" /></div>',
});

export const Default = Template.bind({});
Default.args = {
  modelValue: null,
  placeholder: 'search'
};
