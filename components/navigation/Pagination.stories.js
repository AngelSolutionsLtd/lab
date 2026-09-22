import { ref } from 'vue';
import Pagination from './Pagination.vue';

export default {
    title: 'Components/Navigation/Pagination',
    component: Pagination,
    tags: ['autodocs'],
    argTypes: {
        loading: {
            control: 'boolean',
            description: 'Disables all pagination controls while a page of data is being fetched.',
        },
        maxVisibleButtons: {
            control: 'number',
            description: 'How many numbered page links to show at once. Simple mode only — ignored when enhancedMode is true.',
        },
        totalPages: {
            control: 'number',
            description: 'Total number of pages available. Drives the page numbers, the "of N pages" label, and the Last button.',
        },
        totalPagesText: {
            control: 'boolean',
            description: 'Shows the "X of N pages" text alongside the controls. Simple mode only.',
        },
        total: {
            control: 'number',
            description: 'Total number of records across all pages.',
        },
        perPage: {
            control: 'number',
            description: 'Number of records shown per page.',
        },
        currentPage: {
            control: 'number',
            description: 'The page currently being displayed. This is a prop, not internal state — the parent must update it in response to the pagechanged event.',
        },
        enhancedMode: {
            control: 'boolean',
            description: 'Switches from numbered page links to a "go to page" input, a submit button, and a rows-per-page selector.',
        },
        currentRowsPerPage: {
            control: 'select',
            description: 'Initial value of the rows-per-page selector. Enhanced mode only.',
            options: [25, 50, 75],
        },
    }
};

const Template = (args) => ({
  components: { Pagination },
    setup() {
        const page = ref(args.currentPage);

        const onPageChanged = (newPage) => {
            page.value = newPage;
        };

        return { args, page, onPageChanged };
    },

    template: `
        <Pagination
            v-bind="args"
            :current-page="page"
            @pagechanged="onPageChanged"
        />
    `,
})

export const Default = Template.bind({})
Default.args = {
    totalPages: 10,
    total: 250,
    perPage: 25,
    currentPage: 5,
    maxVisibleButtons: 3,
    totalPagesText: true,
    enhancedMode: false,
    loading: false,
    currentRowsPerPage: 25,
}

export const EnhancedMode = Template.bind({})
EnhancedMode.args = {
    ...Default.args,
    enhancedMode: true,
}

export const Loading = Template.bind({})
Loading.args = {
    ...Default.args,
    loading: true,
}

export const SinglePage = Template.bind({})
SinglePage.args = {
    ...Default.args,
    totalPages: 1,
    total: 18,
    currentPage: 1,
}

export const LastPage = Template.bind({})
LastPage.args = {
    ...Default.args,
    currentPage: 10,
}