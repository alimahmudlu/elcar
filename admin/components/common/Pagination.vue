<template>
    <div class="mb-3 mb-sm-6">

        <div class="text-center" v-intersect="onIntersect" v-if="options.infiniteScroll">
            <v-btn icon color="primary" :loading="loading" v-intersect="onIntersectLoading">
                <span class="d-none" v-text="'loading...'"/>
            </v-btn>
        </div>

        <v-pagination v-model="page" :length="lastPage" :total-visible="$vuetify.breakpoint.smAndDown ? 5 : 7" v-else/>

    </div>
</template>

<script>
export default {
    name: "Pagination",

    props:{
        options: Object,
        lastPage: Number,
        limit: Number,
        skip: Number,
    },

    data: (app)=> ({
        page: ((app.skip || 0) / app.limit) + 1,
        loading: false,
    }),

    watch: {
        '$route.query': {

            immediate: true,

            handler(val) {

                if (Object.keys(val).length !== 0) {
                    this.page = parseInt(val.page) || 1
                }

            }
        },

        page(val){

            if(this.options.infiniteScroll){

                this.$emit('page', val)

            }else{

                if(process.client){
                    window.scrollTo(0, 0)
                }

                this.$pushQuery('page', val)

            }
        }
    },
    methods: {

        onIntersect(entries, observer, isIntersecting) {
            if (isIntersecting) {
                this.loading = true
            }
        },

        onIntersectLoading(entries, observer, isIntersecting) {
            if (isIntersecting) {
                this.page++
            }
        },

    },
}
</script>
