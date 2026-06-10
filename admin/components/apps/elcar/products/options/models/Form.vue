<template>
    <v-card tile class="d-flex flex-column fill-height">

        <div class="elevation-1 d-flex justify-space-between align-center z-index-2 pr-4">

            <v-card-title class="pa-2 pl-md-4 py-md-3 font-weight-bold">

                <Icon :name="data.id ? 'mdiPencil' : 'mdiPlus'" left/>

                {{ $t(data.id ? 'Edit' : 'Add') }}

            </v-card-title>

            <v-btn icon @click="$emit('close')">
                <Icon name="mdiClose"/>
            </v-btn>

        </div>

        <div class="flex-fill px-3 px-md-6 pt-6 overflow-auto">

            <v-select v-model="form.section" :label="$t('Section')"
                      outlined dense :items="sections" item-text="name" item-value="key"
                      :append-icon="mdiChevronDown" :no-data-text="$t('No data')"
                      :error-messages="$errorMessages($v.form.section, $t('Section'))"
                      @change="form.brand = null"/>

            <v-select v-model="form.brand" :label="$t('Brand')"
                      outlined dense :items="brands" item-text="name" item-value="_id"
                      :append-icon="mdiChevronDown" :no-data-text="$t('No data')"
                      :error-messages="$errorMessages($v.form.brand, $t('Brand'))"/>

            <v-text-field v-model="form.name" :label="$t('Name')" required outlined dense
                          :error-messages="$errorMessages($v.form.name, $t('Name'))"/>

        </div>

        <div class="d-flex justify-end pa-3 px-md-7 elevation-6 z-index-1">
            <SaveButton :api="api" :form="form" :validation="$v.form" :callback="()=> close()"/>
        </div>

    </v-card>
</template>

<script>

import {validationMixin} from 'vuelidate';
import {required, minLength} from 'vuelidate/lib/validators';

import {mdiChevronDown} from '@mdi/js'

export default {

    name: 'ModelsForm',

    mixins: [validationMixin],

    props: {
        data: Object,
    },

    data: () => ({

        api: 'models',

        form: {
            section: null,
            brand: null,
            name: null,
        },

        mdiChevronDown
    }),

    validations(){
        return {
            form: {
                name: {
                    required,
                    minLength: minLength(2)
                },
                brand: {
                    required
                },
                section: {
                    required
                },
            },
        }
    },

    async created() {
        await this.getData()
    },

    computed:{

        sections(){
            return this.$store.state.data.productSections
        },

        brands(){
            return this.$store.state.data.brands?.filter(brand => brand.sections.includes(this.form.section))
        }
    },

    methods:{

        async getData(){

            if(this.data.id){

                const data = await this.$fetchData({
                    api: `${this.api}/${this.data.id}`,
                    force: true
                })

                this.form = structuredClone(data)

            }

            await this.$fetchData({
                store: 'data',
                api: 'brands',
            })
        },

        close(){
            this.$emit('close')
            this.$reFetch()
        }
    }

};

</script>
