import ResponsiveTabs from './ResponsiveTabs.vue';
import NavTabs from './NavTabs.vue';

export default {
	title: 'Components/ResponsiveTabs',
	component: ResponsiveTabs,
	tags: ['autodocs'],
	argTypes: {
		navList: { 
			control: 'array',
			description: 'List of navigation links with title and responsiveName',
		}
	},
};

const Template = (args) => ({
	components: { ResponsiveTabs, NavTabs },
	setup() {
        const setMenuText = (link) => {
            args.menuText = link;
        };
		return { args, setMenuText };
	},
	template: `
		<ResponsiveTabs :navList="args.navList">
            <template #tabs>
                <NavTabs :navList="args.navList" @setActiveRoute="setMenuText" />
            </template>
        </ResponsiveTabs>
	`,
});

export const Default = Template.bind({});
Default.args = {
	navList: [
		{ title: 'Tab A', responsiveName: 'Tab A' },
		{ title: 'Tab B', responsiveName: 'Tab B' },
		{ title: 'Tab C', responsiveName: 'Tab C' },
	],
    menuText: 'Menu'
};