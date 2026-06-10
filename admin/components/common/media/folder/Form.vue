<template>
    <v-card tile class="d-flex flex-column fill-height overflow-hidden">

        <v-card tile elevation="1" class="d-flex justify-space-between align-center z-index-5 pr-4">

            <v-card-title class="pa-2 pl-md-4 py-md-3 font-weight-bold">

                <Icon name="mdiPlus" left/>

                {{ $t('Folder') }}

            </v-card-title>

            <div class="d-flex align-center ml-auto">

                <v-tooltip bottom>

                    <template #activator="{ on, attrs }">
                        <v-btn icon @click="$emit('close')" v-bind="attrs" v-on="on">
                            <Icon name="mdiClose"/>
                        </v-btn>
                    </template>

                    {{ $t('Close') }}

                </v-tooltip>

            </div>

        </v-card>

        <div class="px-3 pt-7 px-md-7 flex-fill overflow-auto">
            <v-text-field v-model="form.name" :label="$t('Name')" required outlined dense
                          :error-messages="$errorMessages($v.form.name, $t('Name'))"/>
        </div>

        <div class="d-flex justify-space-between pa-3 px-md-7 elevation-6 z-index-1">

            <v-spacer/>

            <SaveButton api="file-folders" :form="form" :validation="$v.form" :callback="callback"/>

        </div>

    </v-card>
</template>

<script>

import {validationMixin} from 'vuelidate';
import {required, minLength} from 'vuelidate/lib/validators';

export default {
    name: 'FileFolderForm',
    mixins: [validationMixin],

    props:{
        data: Object
    },

    data: (app)=> ({
        form: {
            name: null,
            folder: app.data.activeFolder?._id || null,
            modules: [app.data?.appId || app.$appModule()._id]
        }
    }),

    validations: {
        form: {
            name: {
                required,
                minLength: minLength(2)
            },
        },
    },

    created() {
        if(this.data.folder){
            this.form._id = this.data.folder._id
            this.form.name = this.data.folder.name
            this.form.modules = this.data.folder.modules
        }
    },

    methods:{
        callback(data){
            this.$emit('close')
            return this.data.callback(data)
        }
    }
};
</script>
