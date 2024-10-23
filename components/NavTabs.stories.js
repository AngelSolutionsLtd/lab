import NavTabs from './NavTabs.vue';

export default {
	title: 'Components/NavTabs',
	component: NavTabs,
	tags: ['autodocs'],
	argTypes: {
		navList: { 
			control: 'array',
			description: 'List of navigation links with title and responsiveName',
		},
		isVertical: {
			control: 'boolean',
			description: 'Toggles between horizontal and vertical tabs',
			defaultValue: false,
		},
		setWidth: {
			contron: 'boolean',
			description: 'Toggles set width fo horizontal tabs only',
			defaultValue: false
		}
	},
};

const Template = (args) => ({
	components: { NavTabs },
	setup() {
		return { args };
	},
	template: `
		<NavTabs v-bind="args" />
	`,
});

export const DefaultNavTabs = Template.bind({});
DefaultNavTabs.args = {
	navList: [
		{ title: 'Tab A', responsiveName: 'Tab A' },
		{ title: 'Tab B', responsiveName: 'Tab B' },
		{ title: 'Tab C', responsiveName: 'Tab C' },
	],
	isVertical: false,
	setWidth: false,
};

export const VerticalTabs = Template.bind({});
VerticalTabs.args = {
	navList: [
		{ title: 'Layout A', responsiveName: 'Layout A' },
		{ title: 'Layout B', responsiveName: 'Layout B' },
		{ title: 'Layout C', responsiveName: 'Layout C' },
	],
	isVertical: true,
	setWidth: false,
};

export const LongTabs = Template.bind({});
LongTabs.args = {
	navList: [
		{ title: 'Individual', responsiveName: 'Individual' },
		{ title: 'Team', responsiveName: 'Team' },
	],
	isVertical: false,
	setWidth: true,
};

export const NotificationTabs = Template.bind({});
NotificationTabs.args = {
	navList: [
		{ title: 'Targets', responsiveName: 'Targets' },
		{ title: 'Visits', responsiveName: 'Visits', hasNotification: true },
		{ title: 'CPD Needs', responsiveName: 'CPD' },
	],
	isVertical: false,
	setWidth: true
};
