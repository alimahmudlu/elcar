<template>
    <v-btn depressed rounded dark v-bind="$attrs" :color="color || 'primary'"
           :min-width="40" :loading="buttonLoading" @click="save">

        {{ $vuetify.breakpoint.smAndUp ? text || $t('Save') : '' }}

        <Icon :name="icon || `mdiCheck`" :right="$vuetify.breakpoint.smAndUp"/>

    </v-btn>
</template>

<script>

export default {
    name: 'SaveButton',

    props: {
        api: {
            type: String
        },
        customApi: {
            type: String
        },
        method: {
            type: String
        },
        formData: {
            type: Boolean
        },
        form: {
            type: [Object, Array]
        },
        validation: {
            type: Object
        },
        alert: {
            type: Boolean,
        },
        callback: {
            type: Function
        },
        confirms: {
            type: Array
        },
        text: {
            type: String
        },
        icon: {
            type: String
        },
        color: {
            type: String
        },
    },

    data() {
        return {
            buttonLoading: false
        };
    },

    methods: {

        async save() {

            this.setLoading(true);

            await this.$saveData({
                api: this.api,
                customApi: this.customApi,
                method: this.method,
                query: this.query,
                payload: this.form,
                validation: this.validation,
                attributes: this.attributes,
                alert: this.alert,
                isFormData: this.formData,
                callback: this.callback,
                confirms: this.confirms,
            })

            this.setLoading(false);
        },

        setLoading(status) {
            if (this.loading) {
                this.buttonLoading = status;
                this.$emit('loading', status);
            }
        }

    }
};
</script>
