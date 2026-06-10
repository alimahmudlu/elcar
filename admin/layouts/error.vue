<template>
    <v-app dark class="error-layout fill-height lighten">
        <v-card :height="350" max-width="100vw" :width="600" elevation="16" rounded="xl"
                class="ma-auto d-flex align-center justify-center text-center">

            <div>

                <span class="text-h3 text-md-h1 d-block font-weight-black primary--text mb-3 mb-md-6">
                    [ {{error.statusCode}} ]
                </span>

                <p v-text="$t(error.statusText || 'The Page You`re Looking For Was Not Found')"
                   class="font-weight-bold text--secondary"/>

                <v-divider class="mb-4"/>

                <v-btn text rounded color="primary" @click="backAction">
                    <Icon name="mdiArrowLeft" left/>
                    {{$t('Get back')}}
                </v-btn>

            </div>

        </v-card>
    </v-app>
</template>

<script>
export default {
    layout: 'empty',
    middleware: ['check-user-apps'],
    meta:{
        module: 'error',
        section: null,
        action: null
    },
    props: {
        error: {
            type: Object,
            default: null
        }
    },
    methods:{
        backAction(){
            this.$router.go(0)
            /*if(this.error.statusCode === 404){
                this.$router.go(-1)
            }else{
                this.$router.go(0)
            }*/
        }
    }
}
</script>

<style lang="scss">
.error-layout{
    .v-application{
        &--wrap{
            min-height: 100% !important;
        }
    }
}
</style>
