<template>
    <v-navigation-drawer v-model="drawer" app :floating="!$dark()" :touchless="$vuetify.breakpoint.mdAndUp"
                         :width="260" :color="$dark() ? '#181926' : 'lighten'" class="ml-lg-15">

        <template #prepend>
            <h1 v-text="title" class="font-weight-black primary--text ma-0 pa-3" v-if="activeSection"/>
            <v-divider/>
        </template>

        <AppNavBarMenu/>

    </v-navigation-drawer>
</template>

<script>
export default {

    name: "NavBarDrawer",

    mounted() {
        if(this.$vuetify.breakpoint.mdAndUp){
            this.drawer = true
        }
    },

    computed: {

        drawer: {
            get() {
                return this.$store.state.mainNavBar
            },
            set( val ) {
                this.$setState({key: 'mainNavBar', data: val})
            }
        },

        activeSection() {
            return this.$store.state?.activeSection
        },

        title(){
            const moduleKey = this.activeSection.module.name
            return moduleKey === 'general' ? this.$t('General') : this.activeSection.name
        }
    },
}
</script>
