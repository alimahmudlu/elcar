<template>
    <div>

        <template v-if="menuTitle">
            <div class="d-flex justify-space-between align-center">
                <v-subheader class="font-weight-black" v-text="menuTitle"/>

            </div>
            <v-divider/>
        </template>

        <v-list nav dense>
            <v-list-item v-for="(menu, i) in menus" :key="i" :to="$localePath(menu.path)" exact color="primary">

                <v-list-item-icon class="mr-3">
                    <Icon :name="menu.icon"/>
                </v-list-item-icon>

                <v-list-item-content>
                    <v-list-item-title v-text="menu.name"/>
                </v-list-item-content>

            </v-list-item>
        </v-list>
    </div>
</template>

<script>
export default {
    name: 'SideMenu',

    props: {
        menus: Array,
        menuTitle: String
    },

    data: () => ({
    }),
};
</script>
