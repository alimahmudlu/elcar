<template>
    <nav class="d-flex flex-md-column align-md-center text-center"
         :class="{'overflow-auto': positionIs('top') && groupIs('apps')}">

        <div class="fill-width px-6" :class="{'pt-3' : !(positionIs('top') && groupIs('general'))}"
             v-if="!mobile">
            <v-divider :vertical="mobile"/>
        </div>

        <div :class="mobile ? 'd-flex flex-fill justify-space-around' : 'mx-auto'">

            <slot name="start"/>

            <v-tooltip right v-for="(section, i) in $navMenusByParent({group, position})" :key="`section-${i}`">

                <template #activator="{ on, attrs }">
                    <v-hover v-slot="{hover}">
                        <v-btn width="40" height="40" min-width="auto" icon :depressed="isActive(section.route.path)"
                               :color="isActive(section.route.path) && $dark() ? 'lighten--text' : ''"
                               :active-class="$dark() ? 'primary' : 'v-btn--active primary--text elevation-16'"
                               class="pa-4" :aria-label="section.name" v-bind="attrs" v-on="on"
                               :class="[
                                   {'elevation-16': hover},
                                   {'rounded-lg': positionIs('top') || mobile},
                                   {'mt-3': !mobile}
                               ]"
                               :to="$localePath(section.route.path)" :exact="section.route.path === 'index'">

                            <Icon :name="section.menu.icon" size="22" :color="$dark() ? 'white' : 'primary'"/>

                        </v-btn>
                    </v-hover>
                </template>

                {{ section.name }}

            </v-tooltip>

            <slot name="end"/>

        </div>

    </nav>
</template>

<script>
export default {
    name: 'SideBarNavMenu',
    props: {
        group: Array,
        position: Array,
        mobile: Boolean,
    },
    methods: {

        isActive(slug) {
            return this.$routeName().includes(slug);
        },

        positionIs(position) {
            return this.position.includes(position);
        },

        groupIs(group) {
            return this.group && this.group.includes(group);
        },

    }
};
</script>

<style lang="scss">
.main-sidebar {
    .v-navigation-drawer {
        &__content {
            display: flex;
            flex-direction: column;
        }
    }
}
</style>
