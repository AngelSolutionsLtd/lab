import Input from './Input.vue';

export default {
  title: 'Components/Forms/Input',
  component: Input,
  tags: ['autodocs'],
  argTypes: {
    id: { control: 'text', description: 'ID for the input element' },
    placeholder: { control: 'text', description: 'Placeholder text for the input element' },
    labelTitle: { control: 'text', description: 'Label text for the input element' },
  },
};

const Template = (args) => ({
  components: { Input },
  setup() {
    return { args };
  },
  template: `
    <div class="form-fields" style="max-width: 300px">
      <Input v-bind="args" />
    </div>
  `,
});

export const Default = Template.bind({});
Default.args = {
  id: 'input-id',
  placeholder: 'Enter text...',
  labelTitle: 'Title',
};
