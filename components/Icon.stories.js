import Icon from './Icon.vue';
import '../fonts/style.css';

// Export metadata for the component
export default {
    title: 'Components/Icon',
    component: Icon,
};

const Template = (args, { argTypes }) => ({
    components: { Icon },
    props: Object.keys(argTypes),
    template: '<Icon v-bind="$props" />',
});


export const Default = Template.bind({});
Default.args = {
    name: 'shield',
};