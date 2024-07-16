

import Radio from './Radio.vue';


export default {
	title: 'Components/Forms/Radio',
	component: Radio,
	argTypes: {
		selectedValue: { control: { type: 'none' } }
	}
};

const Template = (args, { argTypes }) => ({
	components: { Radio },
	props: Object.keys(argTypes),
	template: '<Radio v-bind="$props" />',
});

export const Default = Template.bind({});
Default.args = {
	id: 'radio1',
	label: 'Option 1',
	value: 'option1',
	selectedValue: '',
	large: false
};

export const Selected = Template.bind({});
Selected.args = {
	id: 'radio2',
	label: 'Option 2',
	value: 'option2',
	selectedValue: 'option2',
	large: false
};

export const RadioLarge = Template.bind({});
RadioLarge.args = {
	id: 'radioLarge1',
	label: 'Option 3',
	value: '1',
	selectedValue: '',
	large: true
};