const tableDynamic = {

    props:{
        api: String,
        stateKey: String,
        query: Object,
        callback: Function,
        force: {
            type: Boolean,
            default: true
        },
    },

    data: ()=> ({
        loading: false,
    }),

    async fetch() {
        await this.getData()
    },

    computed: {

        limit() {
            return this.table.options.itemsPerPage
        },

        skip() {
            return this.table.options.page
        },

        reFetchData(){
            return this.$store.state.reFetchData;
        }

    },

    watch: {

        query(){
            this.getData()
        },

        reFetchData(val){
            if(val === true){
                this.getData()
            }
        },

        limit( limit )  {
            if ( this.tableData?.data || this.tableData ) {
                this.$pushQuery( 'limit', limit )
                setTimeout(()=> this.getData(true), 5)
            }
        },

        skip( val )  {

            const skip = ( val - 1 ) * this.limit

            if ( this.tableData?.data || this.tableData ) {
                this.$pushQuery( 'skip', skip )
                setTimeout(()=> this.getData(true), 5)
            }
        },

    },
    methods: {

        getQueries(){

            const skip = this.$route.query.skip
            const limit = this.$route.query.limit

            if(limit){
                this.table.options.itemsPerPage = +limit
            }

            if(skip){
                this.table.options.page = +skip - 1
            }
        },

        async getData() {

            this.loading = true

            this.content = await this.$fetchData({
                store: 'data',
                api: this.api,
                key: this.stateKey || this.api,
                query: {
                    $skip: this.$route.query.skip || this.skip - 1,
                    $limit: this.$route.query.limit || this.limit,
                    ...this.query,
                },
                force: this.force
            })

            if(this.callback) this.callback(this.content)

            this.loading = false
        },
    }
};

export default tableDynamic
