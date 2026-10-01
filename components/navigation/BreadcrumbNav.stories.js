import BreadcrumbNav from "./BreadcrumbNav.vue";

export default {
    title: 'Components/Navigation/BreadcrumbNav',
    component: BreadcrumbNav,
    tags: ['autodocs'],
    argTypes: {
        routeData: { control: 'array', description: 'List of mock routes for the breadcrumbs' },
    }
};

const Template = (args) => ({
    components: { BreadcrumbNav },
    setup() {

        return { args };
    },
    template: `
        <div class="p-4">
            <BreadcrumbNav v-bind="args" />
        </div>
    `,
});

export const Default = Template.bind({});
Default.args = {
	routeData: [
        { id: 1, title: 'Analysis', routeName: 'Analysis' },
        { id: 2, title: 'Development Feedback', routeName: 'DevelopmentFeedback' }
	],
};
