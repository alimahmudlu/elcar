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

            <v-select v-model="form.section" :label="$t('Section')" outlined dense
                      :append-icon="mdiChevronDown" :no-data-text="$t('No data')"
                      :items="sections" item-text="name" item-value="key"
                      :error-messages="$errorMessages($v.form.section, $t('Section'))"/>

            <div class="d-flex">

                <div v-for="locale in $i18n.locales" :key="`locale-${locale.code}`"
                     v-show="locale.code === $activeLocale()" class="fill-width">

                    <v-text-field v-model="form.name[locale.code]" :label="$t('Name')" required outlined dense
                                  :error-messages="$errorMessages($v.form.name[locale.code], $t('Name'))"/>

                </div>

                <ChangeContentLocale class="ml-2"/>

            </div>

            <v-row>

                <v-col cols="6">
                    <v-switch v-model="form.hasDescription" :label="$t('Has description')" class="ma-0 pa-0"/>
                </v-col>

                <v-col cols="6">
                    <v-switch v-model="form.photo.display" :label="$t('Has photo')" class="ma-0 pa-0"
                              @change="choosePhoto"/>
                </v-col>

                <template v-if="form.photo.display">

                    <v-col cols="6">
                        <v-switch v-model="form.photo.multiple" :label="$t('Multiple')" class="ma-0 pa-0"/>
                    </v-col>

                    <v-col cols="6">
                        <v-switch v-model="form.photo.background" :label="$t('As background')" class="ma-0 pa-0"/>
                    </v-col>

                </template>

            </v-row>

        </div>

        <div class="d-flex justify-end pa-3 px-md-7 elevation-6 z-index-1">
            <SaveButton :api="api" :form="form" :validation="$v.form" :callback="()=> close()"/>
        </div>

    </v-card>
</template>

<script>

import { validationMixin } from 'vuelidate';
import { required, minLength } from 'vuelidate/lib/validators';
import { mdiClose, mdiChevronDown } from '@mdi/js'

export default {

    name: 'CharacteristicGroupsForm',

    mixins: [ validationMixin ],

    props: {
        data: Object,
    },

    data: (app) => ({

        api: 'characteristic-groups',

        form: {
            section: null,
            name: app.$setForLocale(),
            hasDescription: false,
            photo: {
                display: false,
                multiple: false,
                background: false
            }
        },

        mdiClose,
        mdiChevronDown

    }),

    validations() {
        return {
            form: {
                name: this.$setForLocale({
                    required,
                    minLength: minLength(2)
                }),
                section: {
                    required,
                }
            },
        }
    },

    async created() {

        if (this.data.id) {
            const data = await this.$fetchData({
                api: `${ this.api }/${ this.data.id }`,
                query: {
                    section: this.data.section
                },
                force: true
            })

            this.form = structuredClone(data)
        }
    },

    computed: {

        sections() {
            return this.$store.state.data.productSections
        }
    },

    methods: {
        close() {
            this.$emit('close')
            this.$reFetch()
        },

        choosePhoto(){
            if(!this.form.photo.display){
                this.form.photo.multiple = false
                this.form.photo.background = false
            }
        }
    }

};

</script>
