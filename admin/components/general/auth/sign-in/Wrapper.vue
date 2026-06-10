<template>
    <v-container class="my-3 my-sm-auto z-index-2">
        <v-row justify="center">
            <v-col lg="9">
                <v-row no-gutters class="elevation-16 rounded-lg overflow-hidden">

                    <v-col>
                        <v-card tile flat dark class="fill-height primary d-flex align-center pa-6">
                            <div class="fill-width text-center">

                                <v-img :src="require('static/design/figure.png')" :aspect-ratio="1.5" contain/>

                                <h1 class="mt-5 lh-1-2 text-h5 text-md-h4 font-weight-black"
                                    v-html="$t('Welcome to _', {n: $byLocale(app.name)})"/>

                                <p class="mb-0 mt-2 text-caption">
                                    {{ $t('Created by') }}
                                    <a :href="app.creator.link" target="_blank" rel="noopener noreferrer" class="font-weight-black">
                                        <u v-text="app.creator.name"/>
                                    </a>
                                </p>

                            </div>
                        </v-card>
                    </v-col>

                    <v-col cols="12" sm="6">
                        <v-card tile flat class="fill-height pa-6 pa-md-12 pt-md-16">

                            <h2 class="font-weight-black text-md-h4 primary--text mb-3" v-text="$t('Hello')"/>

                            <p class="text-body-2 lh-1-6 grey--text mb-6 mb-md-10"
                               v-text="$t('Sign in and control a great amount of new opportunities')"/>

                            <AuthSignInForm/>

                        </v-card>
                    </v-col>

                </v-row>
            </v-col>
        </v-row>
    </v-container>
</template>

<script>

export default {
    name: 'index',

    computed:{
        app(){
            return this.$store.state.app
        }
    }
}
</script>
