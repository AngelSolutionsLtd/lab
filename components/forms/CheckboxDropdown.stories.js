import { ref } from 'vue';
import CheckboxDropdown from './CheckboxDropdown.vue';

export default {
  title: 'Components/Forms/CheckboxDropdown',
  component: CheckboxDropdown,
  tags: ['autodocs'],
  argTypes: {
    options: { control: 'array', description: 'Selectable items' },
    selectedContextSingle: { control: 'text', description: 'Singular noun for an item' },
    selectedContextPlural: { control: 'text', description: 'Plural noun for an item' },
    selectedContextAll: { control: 'text', description: 'Title shown when every option is selected' },
    useAnyItemOption: { control: 'boolean', description: 'Treats one option as a mutually exclusive "any" choice' },
    anyOptionValue: { control: 'number', description: 'The Id of the option to treat as any' },
    searchable: { control: 'boolean', description: 'Shows the search box above the list' },
    showControls: { control: 'boolean', description: 'Shows the Select All checkbox and CLEAR button' },
    modelValue: { control: 'array', description: 'The Ids of the checked items' },
  },
};

const Template = (args) => ({
  components: { CheckboxDropdown },
  setup() {
    const selected = ref(args.modelValue ?? []);
    return { args, selected };
  },
  template: '<CheckboxDropdown v-bind="args" v-model="selected" />',
});

export const Default = Template.bind({});
Default.args = {
  options: [
    { Id: 1, Name: 'Red' },
    { Id: 2, Name: 'Blue' },
    { Id: 3, Name: 'Yellow' },
    { Id: 4, Name: 'Pink' },
    { Id: 5, Name: 'Orange' },
    { Id: 6, Name: 'Dark Green' },
    { Id: 7, Name: 'Lilac' },
    { Id: 8, Name: 'White' },
    { Id: 9, Name: 'Black' },
    { Id: 10, Name: 'Sand' },
    { Id: 11, Name: 'Purple' },
    { Id: 12, Name: 'Rainbow Rainbow Rainbow Rainbow Rainbow Rainbow Rainbow Rainbow Rainbow Rainbow Testing Longer Name ...' },
  ],
  selectedContextSingle: 'colour',
  selectedContextPlural: 'colours',
  selectedContextAll: 'All colours',
  anyOptionValue: 0,
  showControls: false,
  searchable: true,
  modelValue: [],
};