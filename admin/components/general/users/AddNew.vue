<template>
    <div>
        <v-btn rounded depressed color="primary" class="white--text" v-if="$can('create', 'general-users')"
               @click="$openDialog({
                        component: `general/users/Form`,
                        options:{
                            width: 900,
                            sideBar: true,
                        }
                   })">
            <Icon name="mdiPlus" :left="$vuetify.breakpoint.smAndUp"/>
            {{ $vuetify.breakpoint.smAndUp ? $t('Add') : '' }}
        </v-btn>
    </div>
</template>

<script>
export default {
    name: "AddContent",
    props: {
        component: Object
    }
}
</script>
