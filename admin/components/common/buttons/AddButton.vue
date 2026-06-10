<template>
    <v-btn rounded depressed dark color="blue" :min-width="40" :height="40"
           class="px-2 px-sm-4" @click="options.action() || false">

        <Icon name="mdiPlus" :left="$vuetify.breakpoint.smAndUp"/>

        <template v-if="$vuetify.breakpoint.smAndUp">
            {{ options.name ? $t('Add_', {n: options.name}) : $t('Add')}}
        </template>

    </v-btn>
</template>

<script>
export default {
    name: "AddButton",
    props:{
        options: {
            type: Object
        }
    }
}
</script>
