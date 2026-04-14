import Textarea from './Textarea.vue';

export default {
	title: 'Components/Forms/Textarea',
	component: Textarea,
	tags: ['autodocs'],
	argTypes: {
		id: { control: 'text', description: 'ID for the input element' },
		labelTitle: { control : 'text',  description: 'Name attribute for the label element'},
	},
};

const Template = (args, { argTypes }) => ({
	components: { Textarea },
	props: Object.keys(argTypes),
	template: '<div class="form-fields" style="max-width: 300px"><Textarea v-bind="$props" /></div>',
});
  
export const Default = Template.bind({});
Default.args = {
	id: 'id',
	labelTitle: 'Description'
};