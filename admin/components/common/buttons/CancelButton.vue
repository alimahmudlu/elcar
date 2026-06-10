<template>
    <v-btn depressed rounded :height="40" :min-width="40" class="px-2 px-sm-4" @click="cancel">

        {{ $vuetify.breakpoint.smAndUp ? text || $t('cancel') : '' }}

        <Icon name="mdiClose" :right="$vuetify.breakpoint.smAndUp"/>

    </v-btn>
</template>

<script>

export default {
    name: "CancelButton",
    props: {
        text: {
            type: String,
        },
        reFetchData: {
            type: Boolean,
            default: false
        }
    },
    methods:{
        cancel() {

            this.$emit('cancel')

            if(this.reFetchData){
                this.$reFetch()
            }
        },
    }
}
</script>
