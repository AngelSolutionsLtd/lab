import RagDropdown from './RagDropdown.vue';

export default {
  title: 'Components/Forms/Dropdowns/RagDropdown',
  component: RagDropdown,
  tags: ['autodocs'],
  argTypes: {
    options: { control: 'array', description: 'Options avaliable to select' },
    condensed: { control: 'boolean', description: 'Condensed uses only the initial of the colour or N for not set' },
    fullWidth: { control: 'boolean', description: 'Dropdown is full width' },
    defaultValue: { control: ['number' , 'string'], description: 'If no defaultValue is passed it selects whichever option has initial N' },
    readonly: { control: 'boolean', description: 'Unselectable' },
  },
};

const Template = (args) => ({
  components: { RagDropdown },
  setup() {
    return { args };
  },
  template: '<div style="max-width: 400px"><RagDropdown v-bind="args" /></div>',
});

export const Default = Template.bind({});
Default.args = {
	options: [
		{ id: 0, initial: 'O', label: 'Outstanding', classname: 'green' },
		{ id: 1, initial: 'R', label: 'Requires Improvement', classname: 'amber' },
		{ id: 2, initial: 'I', label: 'Inadequate', classname: 'red' },
		{ id: 3, initial: 'N', label: 'Not Set', classname: 'not-set' },
	],
	condensed: false,
	fullWidth: false,
	defaultValue: '',
	readonly: false
};

export const ReadOnly = Template.bind({});
ReadOnly.args = {
	options: [
		{ id: 0, initial: 'O', label: 'Outstanding', classname: 'green' },
		{ id: 1, initial: 'R', label: 'Requires Improvement', classname: 'amber' },
		{ id: 2, initial: 'I', label: 'Inadequate', classname: 'red' },
		{ id: 3, initial: 'N', label: 'Not Set', classname: 'not-set' },
	],
	condensed: true,
	fullWidth: false,
	defaultValue: '',
	readonly: true
};
