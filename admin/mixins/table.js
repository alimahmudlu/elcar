import {
    mdiArrowCollapseLeft,
    mdiArrowCollapseRight,
    mdiChevronLeft,
    mdiChevronRight
} from '@mdi/js';

const tableGeneral = {
    props: {
        data: [ Object, Array ],
        headers: Array,
        options: Object,
        actions: Array,
        dateValues: Array,
        offsetId: String,
        selected: [ Array, Object, Number, String, null ],
    },

    data: (app) => ({

        content: null,

        table: {
            data: [],
            options: {
                itemsPerPage: 15,
                page: 1,
                serverItemsLength: null,
                height: `calc(100vh - (120px + var(--extra-gutter)))`
            },
            headerProps: {
                sortable: false
            },
            footerProps: {
                itemsPerPageOptions: [
                    15,
                    25,
                    50,
                    100,
                ],
                itemsPerPageText: '',
                pageText: `{0}-{1}, ${ app.$t('Total') } {2}`,
                firstIcon: mdiArrowCollapseLeft,
                lastIcon: mdiArrowCollapseRight,
                prevIcon: mdiChevronLeft,
                nextIcon: mdiChevronRight
            },
        }
    }),

    async fetch() {
        await this.setTable(this.tableData)
    },

    mounted() {
        this.setTable(this.tableData)
    },

    computed:{
        tableData(){
            return this.data || this.content
        }
    },

    watch: {
        tableData: {
            deep: true,
            handler(val) {
                this.setTable(val)
            }
        },
    },

    methods: {

        setTable(data) {
            if (data) {
                this.table.data = data.data || data
                this.table.options.serverItemsLength = this.tableData?.meta ? this.tableData.meta.total : this.tableData.length
            }
        },

        async insertColumns({ condition, index, text, value, sortable = false, align = null }) {
            if (condition || typeof condition === 'undefined') {

                let column = { text, value, sortable }

                if (align) {
                    column.align = align
                }

                await this.table.headers.insert(index, column);
            }
        },
    }
};

export default tableGeneral
