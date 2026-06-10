<template>
    <v-btn depressed rounded :height="40" :min-width="40" class="px-2 px-sm-4 red--text"
           @click="$deleteData({api, callback})">

        <Icon name="mdiDelete" :left="$vuetify.breakpoint.smAndUp"/>

        {{ $vuetify.breakpoint.smAndUp ? $t('Delete') : '' }}

    </v-btn>
</template>

<script>

export default {
    name: "DeleteButton",

    props:{
        api: String,
        callback: Function
    },
}
</script>
