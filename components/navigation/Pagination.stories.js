import { ref } from 'vue';
import Pagination from './Pagination.vue';

export default {
  title: 'Components/Navigation/Pagination',
  component: Pagination,
  tags: ['autodocs'],
  argTypes: {
    loading: { control: 'boolean' },
    maxVisibleButtons: { control: 'number' },
    totalPages: { control: 'number' },
    totalPagesText: { control: 'boolean' },
    total: { control: 'number' },
    perPage: { control: 'number' },
    currentPage: { control: 'number' },
    enhancedMode: { control: 'boolean' },
    currentRowsPerPage: { control: 'select', options: [25, 50, 75] },
  },
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
