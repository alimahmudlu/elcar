<template>
    <v-navigation-drawer v-model="drawer" :floating="!$dark() && navMenu" :touchless="true" fixed app width="60"
                         class="main-sidebar z-index-9">

        <template #prepend>

            <AppSideBarLogo :height="37" :width="37"/>

        </template>

        <AppSideBarNavMenu :position="['top']" :group="['general']"/>

        <AppSideBarNavMenu :position="['top']" :group="['apps']" class="fill-height"/>

        <template #append>

            <AppSideBarNavMenu :position="['bottom']" :group="['general']"/>

            <div class="d-flex flex-column align-center justify-center text-center my-3">

                <AppSideBarLanguage/>

                <AppSideBarDarkMode/>

            </div>

            <v-divider class="mx-6"/>

            <div class="d-flex flex-column align-center justify-center py-3 text-center">

                <AppSideBarUserMenu/>

            </div>

        </template>

    </v-navigation-drawer>
</template>

<script>
export default {
    name: "NavDrawer",

    props:{
        navMenu: Boolean
    },

    data: (app)=> ({
        drawer: app.$vuetify.breakpoint.mdAndUp
    }),

    watch: {
        '$store.state.mobileMenu'(val) {
            if (val === false || val === true) {
                this.drawer = true
            }
        }
    },
}
</script>
