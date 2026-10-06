import StatusDropdown from './StatusDropdown.vue'

export default {
  title: 'Components/Forms/Dropdowns/StatusDropdown',
  component: StatusDropdown,
  tags: ['autodocs'],
  argTypes: {
    options: { control: 'object', description: 'The statuses to choose from' },
    defaultValue: { control: 'number', description: 'The id of the option shown as selected' },
    readonly: { control: 'boolean', description: 'Renders the selected status as a static pill with no dropdown' },
    selectOption: { action: 'selectOption', description: 'Option object that has been chosen' },
  },
};

const Template = (args) => ({
  components: { StatusDropdown },
  setup() { return { args }; },
  template: `<div style="max-width: 200px"><StatusDropdown v-bind="args"/></div>`,
});

export const Default = Template.bind({});
Default.args = {
  options: [
    { id: 0, label: 'Not Started', classname: 'not-started' },
    { id: 1, label: 'In Progress', classname: 'in-progress' },
    { id: 2, label: 'Completed', classname: 'completed' },
    { id: 3, label: 'Deferred', classname: 'deferred' },
    { id: 4, label: 'Cancelled', classname: 'cancelled'},
  ],
  defaultValue: 0,
  readonly: false,
};

export const ReadOnly = Template.bind({});
ReadOnly.args = {
    options: [
    { id: 0, label: 'Not Started', classname: 'not-started' },
    { id: 1, label: 'In Progress', classname: 'in-progress' },
    { id: 2, label: 'Completed', classname: 'completed' },
    { id: 3, label: 'Deferred', classname: 'deferred' },
    { id: 4, label: 'Cancelled', classname: 'cancelled'},
  ],
  defaultValue: '',
  readonly: true
};