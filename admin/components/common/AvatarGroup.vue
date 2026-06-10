<template>
    <div class="avatar-group d-flex align-center rounded-pill">

        <template v-for="(user, i) in users" v-if="i < 3">
            <v-tooltip :key="`user-avatar-${i}`"
                       :top="tooltipPosition === 'top'"
                       :bottom="tooltipPosition === 'bottom'"
                       :left="tooltipPosition === 'left'"
                       :right="tooltipPosition === 'right'">

                <template #activator="{ on, attrs }">
                    <v-avatar :color="borderColor" :size="26" class="text-caption bg" :class="{'ml-n2': i > 0}"
                              :style="`z-index: calc(3 - ${i}); border: 1px solid currentColor !important`"
                              v-bind="attrs" v-on="on">

                        <img v-if="user.photo" :src="user.photo" width="24" height="24" :alt="userFullName(user)"/>

                        <small class="white--text font-weight-bold" v-text="$nameInitials(userFullName(user))" v-else/>

                    </v-avatar>
                </template>

                {{ userFullName(user) }}

            </v-tooltip>
        </template>

        <v-avatar :size="26" class="text-caption bg ml-n2" v-if="users.length > 3">
            <small class="white--text" v-text="`+${users.length - 3}`"/>
        </v-avatar>

    </div>
</template>

<script>

import colors from 'vuetify/lib/util/colors'

export default {
    name: 'UserAvatar',
    props: {
        users: Array,
        tooltipPosition: {
            type: String,
            default: 'top'
        },
        borderColor: {
            type: String,
            default: 'primary'
        }
    },

    computed:{
        color(){
            if(this.borderColor){

                const color = this.borderColor.split(' ')[0]?.toCamelCase()
                let modifier = this.borderColor.split(' ')[1]

                if(modifier){
                    let darkModifier = modifier.split('-')[0]
                    let darkLevel = modifier.split('-')[1]
                    if(darkLevel){
                        darkLevel = parseInt(darkLevel)
                        if(darkLevel < 4){darkLevel = darkLevel + 1}
                    }
                    modifier = darkModifier += darkLevel
                }

                return  color === 'primary' ? 'var(--v-primary-darken1)' : colors[color][modifier]

            }else{

                return 'var(--avatar-border-color)'
            }
        },
    },

    methods: {
        userFullName(user) {
            return `${user.name} ${user.surname}`;
        },
    }
};
</script>

<style lang="scss">
.avatar-group{
    .bg{
        background-color: rgba(0,0,0,.1) !important;
    }
}
</style>
