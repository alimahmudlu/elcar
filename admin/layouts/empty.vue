<template>
    <v-app :dark="$dark()" class="lighten">

        <Nuxt/>

        <LazyDialogsWrapper/>
    </v-app>
</template>

<script>

import head from '@/plugins/meta-data';

export default {

    middleware: ['auth'],

    head,

    created() {
        this.$vuetify.theme.dark = !!this.$storage.getCookie('darkMode');
    },

};
</script>

<style lang="scss">
@import "assets/global";
</style>
