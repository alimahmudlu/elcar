<template>
    <v-card tile class="pa-7 text-center">

        <template v-if="loading">
            <v-progress-circular :size="60" :width="7" color="primary" indeterminate/>
        </template>

        <template v-else>

            <Icon :name="icon" :color="color" size="80" class="animate__animated animate__zoomIn animate__faster mb-2"/>

            <p v-if="data.title" v-text="data.title" class="font-weight-black mb-2 text-body-1 text-uppercase"/>
            <p v-if="data.message" v-text="data.message" class="text-body-2 lh-1-6"/>
            <div v-if="data.html" v-html="data.html" class="text-body-2 lh-1-6"/>

            <div class="pt-2 d-flex justify-center">

                <template v-if="typeof data.closeBtn === 'undefined' || data.closeBtn !== false">
                    <v-btn depressed rounded :color="color || data.confirmBtn ? '' : 'primary'" @click="close" class="mx-1">
                        {{ data.closeText || $t('Close') }}
                        <Icon name="mdiClose" right v-if="!data.closeText"/>
                    </v-btn>
                </template>

                <v-btn v-if="data.confirmBtn || data.onConfirm || data.preConfirm" depressed rounded color="primary"
                       dark class="mx-1" @click="confirm">
                    {{ data.confirmText || $t('Ok') }}
                    <Icon name="mdiCheck" right/>
                </v-btn>

            </div>
        </template>

    </v-card>
</template>

<script>

import { mdiClose } from '@mdi/js';

export default {

    name: 'AlertWrapper',

    props: {
        data: Object,
        index: Number
    },

    data: () => ({
        mdiClose,
        loading: false
    }),

    async created() {

    },

    computed:{

        options(){
            return this.data.options
        },

        icon(){
            let icon

            switch (this.data.type) {
                case 'error':
                    icon = 'mdiAlert'
                    break;
                case 'warning':
                    icon = 'mdiAlertOutline'
                    break;
                default:
                    icon = 'mdiCheckboxMarkedCircleOutline'
                    break;

            }

            return this.data.icon || icon
        },

        color(){
            let color

            switch (this.data.type) {
                case 'error':
                    color = 'red'
                    break;
                case 'warning':
                    color = 'deep-orange'
                    break;
                default:
                    color = 'green'
                    break;
            }

            return color
        }
    },

    methods: {

        async confirm(){

            this.loading = true

            if(this.data.preConfirm){
                await this.data.preConfirm()
            }

            if(this.data.onConfirm){
                await this.data.onConfirm()
                this.loading = false
                this.$store.commit('CLOSE_DIALOG', this.index)
            }
        },

        async close(){

            if(this.data.onClose){
                await this.data.onClose()
            }

            this.loading = false
            this.$store.commit('CLOSE_DIALOG', this.index)
        },

    }

};

</script>
