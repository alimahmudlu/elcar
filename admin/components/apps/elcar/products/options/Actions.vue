<template>
    <div class="d-flex">

        <v-btn rounded depressed color="primary" class="white--text mr-2 mr-md-3"
               @click="$openDialog({
                        component: `apps/${$appModule().key}/products/options/${component.options.section}/FilterForm`,
                        data: {
                            section: component.options.section
                        },
                        options:{
                            width: 400
                        }
                   })">
            <Icon name="mdiFilter" :left="$vuetify.breakpoint.smAndUp"/>
            {{ $vuetify.breakpoint.smAndUp ? $t('Filter') : ''}}
        </v-btn>

        <v-btn rounded depressed color="primary" class="white--text"
               v-if="$can('create', `${$appModule().key}-${component.options.section}`)"
               @click="$openDialog({
                    component: `apps/${$appModule().key}/products/options/${component.options.section}/Form`,
                    data: {
                        section: component.options.section
                    },
                    options:{
                        width: 400
                    }
               })">
            <Icon name="mdiPlus" :left="$vuetify.breakpoint.smAndUp"/>
            {{ $vuetify.breakpoint.smAndUp ? $t('Add _', {n: $t('New')}) : ''}}
        </v-btn>

    </div>
</template>

<script>
export default {
    name: "AddContent",
    props:{
        component: Object
    }
}
</script>

