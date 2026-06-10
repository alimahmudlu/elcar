<template>
    <nav class="nav-menu fill-height">
        <v-list nav dense :class="{'d-flex align-center flex-column': mini}">

            <v-list-item :key="activeSection.name" :to="$localePath(activeSection.path)" router exact
                         :class="[{'rounded-lg': mini},{'white--text': $routeIs(activeSection.path)}]"
                         active-class="primary elevation-16" class="pl-0">

                <v-list-item-icon :class="{'mr-3': !mini}">
                    <Icon name="mdiViewDashboardOutline" :color="$routeIs(activeSection.path) ? 'white':''"/>
                </v-list-item-icon>

                <v-list-item-content>
                    <v-list-item-title v-text="$t('Dashboard')"/>
                </v-list-item-content>

            </v-list-item>

            <template v-for="page in navMenusByParent({_id: activeSection._id})">

                <template v-if="navMenusByParent({_id: page._id}).length > 0">

                    <v-menu v-if="mini" offset-x open-on-hover :nudge-right="22" min-width="220"
                            :key="page.name" content-class="side-mini-menu">

                        <template #[`activator`]="{ on, attrs }">
                            <v-list-item v-bind="attrs" v-on="on"
                                         :class="attrs['aria-expanded'] === 'true' ? 'elevation-12' : ''">

                                <v-list-item-icon :class="mini ? 'mx-auto': 'mr-3'">
                                    <Icon :name="page.menu.icon"/>
                                </v-list-item-icon>

                                <v-list-item-content>
                                    <v-list-item-title v-text="page.name"/>
                                </v-list-item-content>

                            </v-list-item>
                        </template>

                        <v-card flat class="overflow-hidden rounded-lg" elevation="16" :color="$dark() ? '#181926' : ''">

                            <v-subheader v-text="page.name"/>

                            <v-divider/>

                            <v-list dense rounded max-height="300" class="overflow-auto transparent">
                                <v-list-item v-for="subPage in navMenusByParent({_id: page._id})" :key="subPage.name"
                                             :to="$localePath(subPage.path)" active-class="primary white--text"
                                             router>
                                    <v-list-item-title v-text="subPage.name"/>
                                </v-list-item>
                            </v-list>

                        </v-card>

                    </v-menu>

                    <v-list-group v-else no-action :key="page.name" :id="page.name"
                                  :color="$vuetify.theme.dark ? 'white' : 'primary'">

                        <template #appendIcon>
                            <Icon name="mdiChevronDown"/>
                        </template>

                        <template #activator>

                            <template v-if="page.type === 'dynamic'">

                                <nuxt-link :to="$localePath(page.path)" router class="d-flex fill-width ml-n2 pl-0"
                                           :active-class="$routeIs(page.path) ? 'primary rounded white--text ml-n2 pl-0' : ''">

                                    <v-list-item-icon :class="{'mr-3': !mini}">
                                        <Icon :name="page.menu.icon" :color="$routeIs(page.path) ? 'white' : ''"/>
                                    </v-list-item-icon>

                                    <v-list-item-content>
                                        <v-list-item-title v-text="page.name"/>
                                    </v-list-item-content>

                                </nuxt-link>

                                <v-divider vertical class="my-2"/>

                            </template>

                            <div class="d-flex flex-fill ml-n2 pl-0" v-else>

                                <v-list-item-icon :class="mini ? 'mx-auto': 'mr-3'">
                                    <Icon :name="page.menu.icon"/>
                                </v-list-item-icon>

                                <v-list-item-content>
                                    <v-list-item-title v-text="page.name"/>
                                </v-list-item-content>

                            </div>

                        </template>

                        <template v-for="page in navMenusByParent({_id: page._id})">

                            <v-list-group v-if="navMenusByParent({_id: page._id}).length > 0"
                                          no-action sub-group :key="page.name" class="ml-n2">

                                <template #[`activator`]>
                                    <v-list-item-content>
                                        <v-list-item-title v-text="page.name"/>
                                    </v-list-item-content>
                                </template>

                                <template v-for="subPage in navMenusByParent({_id: page._id})">
                                    <v-list-item :key="subPage.name" :to="$localePath(subPage.path)" router>
                                        <v-list-item-content>
                                            <v-list-item-title v-text="subPage.name"/>
                                        </v-list-item-content>
                                    </v-list-item>
                                </template>

                            </v-list-group>

                            <v-list-item v-else :to="$localePath(page.path)" router :key="page.name"
                                         class="ml-8 pl-3 mb-1" active-class="primary white--text elevation-16">
                                <v-list-item-content>
                                    <v-list-item-title v-text="page.name"/>
                                </v-list-item-content>
                            </v-list-item>

                        </template>

                    </v-list-group>

                </template>

                <template v-else>
                    <template v-if="page.type === 'dynamic'">
                        <v-list-item :key="page.name" :to="$localePath(page.path)" router
                                     active-class="primary white--text elevation-16" class="pl-0"
                                     :class="[{'rounded-lg': mini}]">

                            <v-list-item-icon :class="{'mr-3': !mini}">
                                <Icon :name="page.menu.icon" :color="$routeIs(page.path) ? 'white':''"/>
                            </v-list-item-icon>

                            <v-list-item-content>
                                <v-list-item-title v-text="page.name"/>
                            </v-list-item-content>

                        </v-list-item>
                    </template>
                </template>

            </template>

        </v-list>
    </nav>
</template>

<script>

import allPages from '../../../structure/pages';
import { mdiChevronDown } from '@mdi/js'

export default {
    name: 'NavBarNavMenu',

    props: {
        mini: Boolean
    },

    data: () => ({
        mdiChevronDown
    }),

    computed: {
        activeSection() {
            return this.$store.state?.activeSection
        },

        activePage() {
            return this.$store.state.activePage
        },
    },

    methods: {

        isActive(slug) {
            return slug === '/' ? this.$route.path === '/' : this.$route.path.includes(slug)
        },

        navMenusByParent(options = {}) {

            const _id = options._id || null

            return allPages.filter(page => page.header.menu.subMenu
                && page.config.route.parent === _id
                && (
                    this.$can('read', `${ page.config.module.name }-${ page.config.module.alias || page.config.module.section }`) ||
                    (this.$can('read', page.config.module.name) && !page.config.module.alias && !page.config.module.section)
                )
            ).map(page => {
                return {
                    _id: page._id,
                    name: this.$byLocale(page.name),
                    menu: page.header.menu,
                    path: page.config.route.path,
                    type: page.config.route.type,
                }
            });
        }

    }
};

</script>

<style lang="scss">

.nav-menu {

    .v-list-item {
        &__icon {
            margin-left: 8px !important;
            min-width: 24px !important;
        }
    }

    .v-list-group {
        &--active {
            > .v-list-group {
                &__header {
                    box-shadow: 0 2px 32px var(--shadow-color) !important;
                }
            }
        }
    }
}

.side-mini-menu {
    contain: inherit !important;
    overflow: visible !important;

    &::before {
        content: '';
        position: absolute;
        width: 24px;
        height: 100%;
        left: -24px;
        top: 0;
        display: block;
    }

    &::after {
        content: '';
        position: absolute;
        border-right: 10px solid #fff;
        border-bottom: 10px solid transparent;
        border-top: 10px solid transparent;
        left: -10px;
        top: 14px;
    }

    &.theme--dark {
        &::after {
            border-right: 10px solid #181926;
        }
    }
}
</style>
