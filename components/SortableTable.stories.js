import SortableTable from './SortableTable.vue';

export default {
    title: 'Components/SortableTable',
    tags: ['autodocs'],
    component: SortableTable,
    argTypes: {
        tableHeaders: { control: 'array' },
        sortColumn: { control: 'text' },
        sortAsc: { control: 'boolean' },
        sortTable: { action: 'sortTable' },
    },
};

const Template = (args, { argTypes }) => ({
    components: { SortableTable },
    props: Object.keys(argTypes),
    data() {
        return {
            rows: [
                { name: 'John Doe', school: 'School Name 3', dueDate: '22/10/24' },
                { name: 'Jane Doe', school: 'School Name 2', dueDate: '22/10/24' },
                { name: 'Gemma Doe', school: 'School Name 1', dueDate: '22/10/24' },
            ],
            currentSortColumn: args.sortColumn, // Match with sortColumn arg
            currentSortAsc: args.sortAsc,
        };
    },
    computed: {
        sortedRows() {
            return [...this.rows].sort((a, b) => {
            const column = this.currentSortColumn === '1' ? 'name' :
                            this.currentSortColumn === '2' ? 'school' :
                            'dueDate';

            const aValue = a[column] ? a[column].toLowerCase() : '';
            const bValue = b[column] ? b[column].toLowerCase() : '';

           
            if (aValue < bValue) {
                return this.currentSortAsc ? -1 : 1;
            }
            if (aValue > bValue) {
                return this.currentSortAsc ? 1 : -1;
            }
            return 0;
            });
        },
    },
    methods: {
        onSortTable({ sortExpr }) {
            if (this.currentSortColumn === sortExpr) {
            this.currentSortAsc = !this.currentSortAsc;
            } else {
            this.currentSortColumn = sortExpr;
            this.currentSortAsc = true;
            }

            this.$emit('sortTable', { sortExpr, sortAsc: this.currentSortAsc });
        },
    },
    template: `
        <sortable-table 
            class="table table--planning-style table--responsive"
            :headers="tableHeaders"
            :sortExpression="currentSortColumn"
            :sortAscending="currentSortAsc"
            @sortTable="onSortTable"
        >
        <tr v-for="row in sortedRows" :key="row.name">
            <td data-th="Name">{{ row.name }}</td>
            <td data-th="School">{{ row.school }}</td>
            <td data-th="Due Date">{{ row.dueDate }}</td>
        </tr>
    </sortable-table>
    `,
});

export const Default = Template.bind({});
Default.args = {
    tableHeaders: [
        { description: 'Name', isSortable: true, sortExpr: '1', width: '20%' },
        { description: 'School', isSortable: true, sortExpr: '2', width: '26%' },
        { description: 'Due Date', isSortable: true, sortExpr: '3', width: '12%' },
    ],
    sortColumn: '2',
    sortAsc: true,
};
