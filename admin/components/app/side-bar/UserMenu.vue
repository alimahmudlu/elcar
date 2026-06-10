<template>
    <v-menu v-model="active" transition="slide-x-transition" offset-x nudge-right="20" :bottom="mobile" v-if="user">

        <template #activator="{ on, attrs }">
            <v-btn text v-bind="attrs" v-on="on" :max-width="40" class="min-w-auto"
                   :class="mobile ? 'rounded-lg' : 'rounded-circle'">

                <v-avatar size="40" :color="mobile ? '' : 'lighten'">

                    <v-img :src="$src(user.photo.src)" :alt="`${user.name} ${user.surname}`"
                           aspect-ratio="1" v-if="user.photo"/>

                    <Icon name="mdiAccountOutline" :color="$dark() ? '' : 'primary'" :size="24" v-else/>

                </v-avatar>

            </v-btn>
        </template>

        <v-card :width="280">

            <div class="text-center pt-10 pb-4">

                <v-avatar size="80" color="lighten">
                    <v-img :src="$src(user.photo.src)" :alt="`${user.name} ${user.surname}`"
                           aspect-ratio="1" v-if="user.photo"/>
                    <Icon name="mdiAccount" size="56" v-else/>
                </v-avatar>

                <v-list dense nav>
                    <v-list-item>
                        <v-list-item-content class="text-center">
                            <v-list-item-title v-text="`${user.name} ${user.surname}`" class="font-weight-bold mb-1"/>
                            <v-list-item-subtitle class="text-caption">
                                {{ current.role.name }}
                            </v-list-item-subtitle>
                        </v-list-item-content>
                    </v-list-item>
                </v-list>

            </div>

            <v-divider/>

            <v-card-actions>
                <v-btn color="primary" text @click="settings">
                    <Icon name="mdiCogOutline" left/>
                    {{ $t('Settings') }}
                </v-btn>
                <v-spacer/>
                <v-btn color="primary" text @click="logout">
                    <Icon name="mdiLogout" left/>
                    {{ $t('Exit') }}
                </v-btn>
            </v-card-actions>

        </v-card>

    </v-menu>
</template>

<script>
export default {
    name: 'UserMenu',

    props: {
        mobile: Boolean
    },

    data: (app) => ({
        active: false,
        menus: [
            {
                name: app.$t('Account'),
                path: 'general-account',
                icon: 'mdiAccountOutline'
            },
            {
                name: app.$t('Account Settings'),
                path: 'general-settings-account',
                icon: 'mdiCogOutline'
            },
        ]
    }),
    computed: {
        user() {
            return this.$auth.user;
        },
        accessList() {
            return this.$auth.user.accessList;
        },
        current() {
            return this.$auth.user.currentAccess;
        }
    },

    methods: {
        async logout() {

            this.$auth.$storage.removeLocalStorage('auth._token.local');
            await this.$storage.removeCookie('auth._token.local');
            await this.$storage.removeCookie('auth.strategy');
            await this.$storage.removeCookie('auth._refresh_token.local');

            this.$auth.logout();
        },

        isOwner(access) {
            return access.workspace.createdBy._id === this.$auth.user._id;
        },

        async changeWorkspace(id) {

            await this.$saveData({
                api: 'users',
                alert: false,
                payload: {
                    _id: this.$auth.user._id,
                    currentAccess: id
                }
            });

            await this.$replacePath(this.$localePath('index'));
            await this.$auth.fetchUser();
            this.$setAbility();
        },

        settings() {
            this.$openDialog({
                component: 'general/users/Form',
                data: this.$auth.user,
                options: {
                    width: 900,
                    sideBar: true
                }
            })
        }
    }
};
</script>
