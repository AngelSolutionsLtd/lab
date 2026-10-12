import { ref } from 'vue';
import GradeDropDown from './GradeDropDown.vue';

export default {
  title: 'Components/Forms/Dropdowns/GradeDropDown',
  component: GradeDropDown,
  tags: ['autodocs'],
  argTypes: {
    options: { control: 'array', description: 'The grades to choose from' },
    modelValue: { control: 'text', description: 'The publicId of the selected grade' },
    readOnly: { control: 'boolean', description: 'Renders the grade as a static pill, with the name and descriptor in a tooltip on hover' },
    updatedBy: { control: 'text', description: 'Name shown in the last-updated message' },
    updatedAt: { control: 'text', description: 'Timestamp for the last-updated message' },
    showMessage: { control: 'boolean', description: 'Shows the last-updated message and the "Save KPI as of today" button' },
    gradesReverse: { control: 'boolean', description: 'Flips the grade list' },
    showInfoBtn: { control: 'boolean', description: 'Shows the "More Info" button' },
    isPreview: { control: 'boolean', description: 'Preview only' },
    showGradeDescriptors: { control: 'boolean', description: 'Adds the descriptor to the read-only tooltip' },
    'update:modelValue': { action: 'update:modelValue', description: 'The chosen grade object' },
    'info-btn-clicked': { action: 'info-btn-clicked', description: 'The "More Info" button was clicked' },
  },
};

const Template = (args) => ({
  components: { GradeDropDown },
  setup() {
    const selected = ref(args.modelValue);
    return { args, selected };
  },
  template: `
    <div style="padding: 60px">
      <GradeDropDown
        v-bind="args"
        :modelValue="selected"
        @update:modelValue="(option) => (selected = option.publicId)" />
    </div>`,
});

const options = [
  { publicId: '1', key: 'O',  name: 'Outstanding',          cssClass: 'ofsted--outstanding',          descriptor: { text: 'Outstanding description' } },
  { publicId: '2', key: 'G',  name: 'Good',                 cssClass: 'ofsted--good',                 descriptor: { text: 'Good description' } },
  { publicId: '3', key: 'R',  name: 'Requires Improvement', cssClass: 'ofsted--requires-improvement', descriptor: { text: 'Requires Improvement description' } },
  { publicId: '4', key: 'I',  name: 'Inadequate',           cssClass: 'ofsted--inadequate',           descriptor: { text: 'Inadequate description' } },
  { publicId: '5', key: 'NS', name: 'Not Set',              cssClass: 'ofsted--no-grade',             descriptor: { text: '' } },
];

export const Default = Template.bind({});
Default.args = {
  options: options,
  modelValue: '1',
  readOnly: false,
  updatedBy: 'T. Teacher',
  updatedAt: '2026-09-14T09:30:00',
  showMessage: false,
  gradesReverse: false,
  showInfoBtn: false,
  isPreview: false,
  showGradeDescriptors: true,
};

export const NoDescriptor = Template.bind({});
NoDescriptor.args = {
  options: options,
  modelValue: '1',
  readOnly: true,
  updatedBy: 'T. Teacher',
  updatedAt: '2026-09-14T09:30:00',
  showMessage: true,
  gradesReverse: false,
  showInfoBtn: true,
  isPreview: false,
  showGradeDescriptors: false,
};

export const NothingSelected = Template.bind({});
NothingSelected.args = {
  options: options,
  modelValue: '5',
  readOnly: true,
  updatedBy: '',
  updatedAt: '',
  showMessage: true,
  gradesReverse: false,
  showInfoBtn: true,
  isPreview: false,
  showGradeDescriptors: true,
};