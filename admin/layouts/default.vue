<template>
    <v-app :dark="$dark()">

        <client-only>

            <AppSideBarDrawer v-if="$vuetify.breakpoint.mdAndUp"/>

            <AppHeaderWrapper v-if="!$routeIs('index')" :nav-menu="hasNavMenu"/>

            <AppNavBarDrawer v-if="hasNavMenu"/>

        </client-only>

        <Nuxt/>

        <client-only>

            <AppFooterWrapper v-if="$routeIs('index') && $vuetify.breakpoint.mdAndUp"/>

            <AppMobileBottomNavBar v-if="$vuetify.breakpoint.smAndDown"/>

        </client-only>

        <LazyDialogsWrapper/>

    </v-app>
</template>

<script>

import head from '@/plugins/meta-data';
import allPages from "@/structure/pages.json";
require('animate.css')

export default {

    middleware: [ 'auth' ],

    head,

    created() {
        this.$setAbility()
        this.$store.commit('RESET_STATE')
        this.$vuetify.theme.dark = !!this.$storage.getCookie( 'darkMode' );
    },

    async fetch() {
        await this.$fetchData( {
            api: 'app-modules',
            key: 'appModules'
        })
    },

    computed:{
        hasNavMenu(){
            const activeSection = this.$store.state.activeSection
            return allPages.filter(page => page.header.menu.subMenu && page.config.route.parent === activeSection?._id).length > 0
        },
    },
};
</script>

<style lang="scss">
@import "assets/global";
</style>
