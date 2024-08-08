import Input from './Input.vue';

export default {
	title: 'Components/Forms/Input',
	component: Input,
	tags: ['autodocs'],
	argTypes: {
		id: { control: 'text', description: 'ID for the input element' },
		placeholder: { control: 'text', description: 'Placeholder text for the input element' },
		labelTitle: { control : 'text',  description: 'Name attribute for the label element'}
	},
};

const Template = (args, { argTypes }) => ({
	components: { Input },
	props: Object.keys(argTypes),
	template: '<div class="form-fields" style="max-width: 300px"><Input v-bind="$props" /></div>',
});
  
export const Default = Template.bind({});
	Default.args = {
	id: 'input-id',
	placeholder: 'Enter text...',
	labelTitle: 'Title'
};