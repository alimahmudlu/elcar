<template>
    <v-app :dark="$dark()" class="login-page relative">

        <OverlayLoading v-if="loading"/>

        <template v-else>
            <Nuxt/>

            <LazyDialogsWrapper/>
        </template>

    </v-app>
</template>

<script>
export default {
    data: ()=> ({
        loading: true
    }),

    created() {
        this.$vuetify.theme.dark = !!this.$storage.getCookie( 'darkMode' );
    },

    mounted() {
        this.$nextTick(() => setTimeout(()=> this.loading = false, 1000))
    },
}
</script>
