<template>
    <v-list-item class="border rounded-lg mb-2">

        <v-list-item-avatar color="lighten" class="my-2">
            <Icon name="mdiBell" small/>
        </v-list-item-avatar>

        <v-list-item-content>

            <v-list-item-title class="mb-1 font-weight-bold" v-text="$t('New invitation')"/>

            <v-list-item-subtitle class="text-caption">
                {{ $t('_ invited you as _', {
                        u: `${notification.createdBy.name} ${notification.createdBy.surname}`,
                        r: notification.role.name
                    })
                }}
            </v-list-item-subtitle>

        </v-list-item-content>

        <v-list-item-action>
            <div class="d-flex flex-nowrap">

                <template v-if="notification.status === 'pending'">
                    <v-btn rounded small depressed v-for="(action, i) in actions" :color="action.color" dark
                           class="ml-2" :key="`action-${i}`" @click="changeStatus(action.key)">
                        {{ action.name }}
                    </v-btn>
                </template>

                <template v-else>
                    <v-chip dark small :color="notification.status === 'rejected' ? 'red' : 'green'">
                        {{ $t(notification.status) }}
                    </v-chip>
                </template>

            </div>
        </v-list-item-action>

    </v-list-item>
</template>

<script>
export default {
    name: 'Item',

    props:{
        notification: Object
    },

    data: (app)=> ({
        actions: [
            {
                name: app.$t('Accept'),
                key: 'accepted',
                color: 'green',
            },
            {
                name: app.$t('Reject'),
                key: 'rejected',
                color: 'red',
            }
        ]
    }),

    methods:{
        async changeStatus(status){

            const payload = {
                ...this.notification,
                status,
            }

            await this.$saveData({
                api: 'user-invitations',
                payload
            })

            this.$emit('reFetch')

            if(status === 'accepted'){
                await this.$auth.fetchUser()
            }
        }
    }
};
</script>
