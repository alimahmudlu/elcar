<template>
    <v-row v-intersect="onIntersect" :dense="options.dense">

        <v-col v-bind="options.grids" :class="options.class" v-for="(item, i) in gridData || limit" :key="`col-${i}`">

            <template v-for="(component, c) in component.components">
                <DynamicComponent :component="component" :data="gridData ? item : null" :item-props="$attrs"
                                  :index="i" :key="`col-${i}-component-${c}`"/>
            </template>

        </v-col>

        <v-col cols="12" v-if="!intersect && pagination && (pageData && pageData.meta.total > limit + pageData.meta.skip)">
            <Pagination :options="options" :last-page="20" :skip="skip" :limit="limit" @page="setPageNumber($event)"/>
        </v-col>

    </v-row>
</template>

<script>

export default {
    name: 'DataGridList',

    scrollToTop: true,

    props: {
        component: Object,
        data: [ Object, Array ],
        reFetch: Boolean
    },

    data: () => ({
        skip: 0,
        pageData: null,
        intersect: false,
    }),

    async fetch() {
        this.skip = this.options.skip
        !this.options.intersect && !this.data && await this.getData();
    },

    computed: {

        options() {
            return this.component.options;
        },

        pagination() {
            return this.options.pagination;
        },

        limit() {
            return this.options.limit;
        },

        gridData() {
            return this.data?.data || this.data || this.pageData?.data || this.pageData;
        },

        reFetchGrid() {
            return this.$store.state.reFetchGrid;
        },

        filter() {
            return this.component.options.filter
        }

    },

    watch: {

        reFetch(val) {
            if (val === true) {
                this.skip = 0
                window.scrollTo(0, 0);
                this.getData()
            }
        },

        reFetchGrid(val) {
            if (val === true) {
                this.skip = 0
                window.scrollTo(0, 0);
                this.getData()
            }
        },

        filter: {
            deep: true,
            handler(val, old) {
                if (JSON.stringify(old) !== JSON.stringify(val)) {
                    this.intersect = true
                    this.skip = 0
                    window.scrollTo(0, 0);
                    this.getData()
                }
            }
        }
    },

    methods: {

        onIntersect(entries, observer, isIntersecting) {
            if (isIntersecting && this.options.intersect && !this.intersect) {
                this.intersect = true
                !this.data && this.getData()
            }
        },

        async getData(push) {

            const { api, filter, sort, stateKey, noPagination, callback } = this.options;

            if (api) {

                const vm = this;

                let query = {
                    filter: {}
                };

                if (filter) {
                    Object.entries(filter).forEach(([ key, value ]) => {
                        if (value && typeof value === 'string' && value.startsWith('fn::')) {
                            const val = value.split('fn::')[1]
                            query.filter[key] = eval(val)
                        } else {
                            query.filter[key] = value
                        }
                    })
                }

                if (this.skip) query.$skip = this.skip;
                if (this.limit) query.$limit = this.limit;

                if (sort && sort.length) query.$sort = sort;
                if (!this.pagination && !this.limit) query.noPagination = 1;

                let key = stateKey || api

                await this.$fetchData({ store: 'data', api, key, query, force: true, push });

                let cloneData = structuredClone(this.$store.state.data[key])
                this.pageData = callback ? callback(cloneData) : cloneData

                this.$setState({key: 'reFetchGrid', data: false})

                setTimeout(() => this.intersect = false, 500)
            }
        },

        setPageNumber(number) {
            this.skip = number > 0 ? ((number - 1) * this.limit) : 0;
            this.getData(true);
        }
    }
};
</script>
