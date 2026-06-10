<template>
    <v-app-bar app max-height="60" height="60" elevate-on-scroll :color="$dark() ? '#181926' : 'white'">
        <div class="clearfix fill-width fill-height">
            
            <div class="d-flex align-center fill-height px-3">
                
                <v-btn icon width="38" height="38" class="ml-0 mr-3 mr-sm-5" @click="toggleNavDrawer" v-if="navMenu">
                    <Icon name="mdiMenu"/>
                </v-btn>
                
                <v-toolbar-title class="font-weight-black" v-text="title"/>
                
                <div class="right-side d-flex align-center flex-nowrap ml-auto" v-if="activePage.body.header">
                    <template v-for="(component, i) in activePage.body.header.components">
                        <DynamicComponent :component="component" v-bind="component.options.attrs" :key="`component-${i}`"/>
                    </template>
                </div>
            
            </div>
            
            <v-divider/>
        
        </div>
    </v-app-bar>
</template>

<script>
export default {
    name: "HeaderWrapper",
    
    props: {
        navMenu: Boolean,
    },
    
    computed: {
        mainNavBar() {
            return this.$store.state.mainNavBar
        },
        
        activePage() {
            return this.$store.state.activePage
        },
        
        activeSection() {
            return this.$store.state.activeSection
        },
        
        title(){
            return this.activePage._id === this.activeSection._id && this.activeSection.module.name !== 'general'
                ? this.$t('Dashboard')
                : this.$byLocale(this.activePage.name);
        }
    },
    
    methods: {
        toggleNavDrawer() {
            this.$setState({ key: 'mainNavBar', data: !this.mainNavBar })
        },
    }
}
</script>

<style lang="scss">
.v-toolbar {
    &__content {
        padding: 0 !important;
    }
}
</style>
