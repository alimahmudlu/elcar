<template>
    <v-btn :to="$localePath(`apps-${$appModule().key}-blog-add`)"
           v-if="$can('create', `${$appModule().key}-${component.options.section}`)"
           rounded depressed color="primary" class="white--text">
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
