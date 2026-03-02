import NavTabs from './NavTabs.vue';
import TippyWrapper from './TippyWrapper.vue';

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
			control: 'boolean',
			description: 'Toggles set width for horizontal tabs only',
			defaultValue: false
		},
		withOptions: {
			control: 'boolean',
			description: 'Toggles options slot',
			default: false
		}
	},
};

const Template = (args) => ({
	components: { NavTabs, TippyWrapper },
	setup() {
		return { args };
	},
	template: `
		<NavTabs v-bind="args">
			<template #options="{ item }">
				<TippyWrapper class="options-popup-tippy ml-auto">
					<template #triggerTarget>
						<button @click.prevent class="btn--default px-2">
							<i class="entypo--dot-3 icon-rotate--90 color--white" />
						</button>
					</template>

					<template #content>
						<div class="options-tooltip has-min-width pl-0">
							<a class="options-tooltip__link"  @click.prevent="">
								<i class="entypo--pencil" />Edit
							</a>
						</div>
					</template>
				</TippyWrapper>
			</template>
		</NavTabs>
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
	withOptions: false
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
	withOptions: false
};

export const LongTabs = Template.bind({});
LongTabs.args = {
	navList: [
		{ title: 'Individual', responsiveName: 'Individual' },
		{ title: 'Team', responsiveName: 'Team' },
	],
	isVertical: false,
	setWidth: true,
	withOptions: false
};

export const NotificationTabs = Template.bind({});
NotificationTabs.args = {
	navList: [
		{ title: 'Targets', responsiveName: 'Targets' },
		{ title: 'Visits', responsiveName: 'Visits', hasNotification: true },
		{ title: 'CPD Needs', responsiveName: 'CPD' },
	],
	isVertical: false,
	setWidth: true,
	withOptions: false
};

export const TabsWithOptions = Template.bind({});
TabsWithOptions.args = {
	navList: [
		{ title: 'Layout A', responsiveName: 'A' },
		{ title: 'Layout B', responsiveName: 'B' },
		{ title: 'Layout C', responsiveName: 'C' },
	],
	isVertical: true,
	setWidth: false,
	withOptions: true
};
