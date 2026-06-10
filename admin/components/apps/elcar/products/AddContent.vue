<template>
    <v-btn :to="$localePath(`apps-${$appModule().key}-products-${component.options.section}-add`)"
           rounded depressed color="primary" class="white--text"
           v-if="$can('create', `${$appModule().key}-${component.options.section}`)">
        <Icon name="mdiPlus" :left="$vuetify.breakpoint.smAndUp"/>
        {{ $vuetify.breakpoint.smAndUp ? $t('Add') : ''}}
    </v-btn>
</template>

<script>
export default {
    name: "AddContent",
    props:{
        component: Object
    }
}
</script>
