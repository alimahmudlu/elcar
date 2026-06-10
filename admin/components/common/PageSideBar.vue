<template>
    <v-navigation-drawer app width="320" touchless color="lighten" class="page-side-bar pl-15">

        <template #prepend v-if="sideBarTabs.length > 1">
            <v-tabs v-model="sideTab" grow background-color="transparent" hide-slider
                    :show-arrows="false">

                <v-tab v-for="(tab, i) in sideBarTabs" :key="`tab-${i + 1}`" class="text-reset">

                    <Icon :name="tab.icon" size="23" v-if="tab.icon" left/>

                    {{ tab.label }}

                </v-tab>

            </v-tabs>
            <v-divider/>
        </template>

        <v-tabs-items v-model="sideTab" class="fill-height transparent">

            <v-tab-item class="fill-height fill-width" v-for="(tab, i) in sideBarTabs" :key="`tab-item-${i}`">
                <slot :name="tab.slot"/>
            </v-tab-item>

        </v-tabs-items>

    </v-navigation-drawer>
</template>

<script>
export default {
    name: 'PageSideBar',

    props: {
        sideBarTabs: Array
    },

    data: () => ({
        drawer: true,
        sideTab: 0,
    }),
};
</script>

<style lang="scss">
.page-side-bar{
    .v-slide-group{
        &__prev, &__next{
            display: none !important;
        }
    }
}
</style>
