<template>
    <v-container class="py-3 py-md-8">
        <v-row justify="center">
            <v-col md="7">
                <v-card rounded="lg" outlined>

                    <v-row align="center">
                        <v-col>
                            <v-card-title class="font-weight-bold">
                                <Icon name="mdiBell" left/>
                                <span v-text="$t('Notifications')"/>
                            </v-card-title>
                        </v-col>
                    </v-row>

                    <v-divider/>

                    <div class="pa-3 pa-md-6">
                        <v-list two-line>
                            <template v-for="(notification, i) in notifications">
                                <NotificationsItem :notification="notification" :key="`notification-divider-${i}`"
                                                   @reFetch="getNotifications"/>
                            </template>
                        </v-list>
                    </div>

                </v-card>
            </v-col>
        </v-row>
    </v-container>
</template>

<script>
export default {
    name: 'NotificationsWrapper',

    props:{
        component: Object,
        data: Array
    },

    data: (app)=> ({
        menus: [
            {
                name: app.$t('All notifications'),
                path: 'general-notifications',
                icon: 'mdiFormatListCheckbox'
            },
        ],
    }),

    computed:{
        notifications(){
            return structuredClone(this.$store.state.data.myInvitations)
        }
    },

    async fetch(){
        await this.getNotifications()
    },

    methods:{
        async getNotifications(){
            await this.$fetchData({
                store: 'data',
                api: 'user-invitations',
                key: 'myInvitations',
                query: {
                    user: this.$auth.user._id
                },
                force: true
            })
        }
    }
};
</script>
