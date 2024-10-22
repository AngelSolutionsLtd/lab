<template>
    <table class="sortable-table">
        <thead>
            <tr v-if="showHeaders">
                <th v-for="(header, index) in headers"
                    :key="index"
                    :width="header.width"
                    :colspan="header.colspan"
                    :class="header.thClass">
                    <template v-if="header.isSortable">
                        <a @click="sortTable(header.sortExpr)">{{ header.description }} <span :class="sortIcon" v-if="sortExpression === header.sortExpr"></span></a>
                    </template>
                    <template v-if="!header.isSortable">
                        {{ header.description }}
                    </template>
                </th>
            </tr>
        </thead>
        <tbody>
            <slot></slot>
        </tbody>
    </table>
</template>

<script type="text/javascript">
    export default {
        name: 'SortableTable',
        props: {
            headers: {
                type: Array,
                required: true
            },
            sortExpression: {
                required: true
            },
            sortAscending: {
                type: Boolean,
                default: true
            },
            showHeaders: {
                type: Boolean,
                default: true
            },
        },
        computed: {
            sortIcon() {
                return this.sortAscending ? 'entypo--up-dir' : 'entypo--down-dir';
            },
        },
        methods: {
            sortTable(sortExpr) {
                if (sortExpr === this.sortExpression) {
                    this.$emit('sortTable', { sortExpr: this.sortExpression, sortAsc: !this.sortAscending });
                }
                else {
                    this.$emit('sortTable', { sortExpr: sortExpr, sortAsc: true });
                }
            }
        }
    }
</script>