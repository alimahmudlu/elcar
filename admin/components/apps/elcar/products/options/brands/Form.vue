<template>
    <v-card tile class="d-flex flex-column fill-height">

        <div class="elevation-1 d-flex justify-space-between align-center z-index-2 pr-4">

            <v-card-title class="pa-2 pl-md-4 py-md-3 font-weight-bold">

                <Icon :name="data.id ? 'mdiPencil' : 'mdiPlus'" left/>

                {{ $t(data.id ? 'Edit' : 'Add') }}

            </v-card-title>

            <div class="d-flex align-center">

                <ChangeContentLocale class="mr-2"/>

                <v-btn icon @click="$emit('close')">
                    <Icon name="mdiClose"/>
                </v-btn>

            </div>

        </div>

        <div class="flex-fill px-3 px-md-6 pt-6 overflow-auto">

            <v-select v-model="form.sections" :label="$t('Section')"
                      outlined dense multiple :items="sections" item-text="name" item-value="key"
                      :append-icon="mdiChevronDown" :no-data-text="$t('No data')"
                      :error-messages="$errorMessages($v.form.sections, $t('Section'))">

                <template #selection="{ item, index }">

                    <span v-if="index === 0" v-text="item.name"/>

                    <v-chip x-small dark color="deep-orange" v-if="index === 1" class="pa-1 ml-2">
                        +{{ form.sections.length - 1 }}
                    </v-chip>

                </template>

                <template #item="{ active, item, attrs, on }">
                    <v-list-item v-on="on" v-bind="attrs" #default="{ active }">

                        <v-list-item-action>
                            <v-checkbox :input-value="active" :on-icon="mdiCheckboxMarked"
                                        :off-icon="mdiCheckboxBlankOutline"/>
                        </v-list-item-action>

                        <v-list-item-content>
                            <v-list-item-title v-text="item.name"/>
                        </v-list-item-content>

                    </v-list-item>
                </template>

            </v-select>

            <v-text-field v-model="form.name" :label="$t('Name')" required outlined dense
                          :error-messages="$errorMessages($v.form.name, $t('Name'))"/>

            <div v-for="locale in $i18n.locales" :key="`description-locale-${locale.code}`"
                 v-show="locale.code === $activeLocale()">
                <v-textarea v-model="form.description[locale.code]" :label="$t('Description')"
                            outlined dense counter rows="3" cols="30"/>
            </div>

            <v-switch v-model="form.top" :label="$t('Best seller')" class="ma-0 pa-0"
                      :on-icon="mdiCheckboxMarked" :off-icon="mdiCheckboxBlankOutline"/>

            <MediaMenu v-model="form.logo" :title="$t('Choose _', {n: $t('Logo')})"
                       :upload="false" :multiple="false" :dimensions="[300,300]" size="6"
                       :error-messages="$errorMessages($v.form.logo, $t('Logo'))"/>

        </div>

        <div class="d-flex justify-end pa-3 px-md-7 elevation-6 z-index-1">
            <SaveButton :api="api" :form="form" :validation="$v.form" :callback="()=> close()"/>
        </div>

    </v-card>
</template>

<script>

import { validationMixin } from 'vuelidate';
import { required, minLength } from 'vuelidate/lib/validators';

import { mdiCheckboxMarked, mdiCheckboxBlankOutline, mdiChevronDown } from '@mdi/js'

export default {

    name: 'BrandsForm',

    mixins: [ validationMixin ],

    props: {
        data: Object,
    },

    data: (app) => ({

        api: 'brands',

        form: {
            sections: [],
            name: null,
            logo: null,
            description: app.$setForLocale(),
            top: false,
        },

        mdiCheckboxMarked,
        mdiCheckboxBlankOutline,
        mdiChevronDown
    }),

    validations() {
        return {
            form: {
                name: {
                    required,
                    minLength: minLength(2)
                },
                logo: {
                    required
                },
                sections: {
                    required
                },
            },
        }
    },

    async created() {
        if (this.data.id) {
            const data = await this.$fetchData({ api: `${ this.api }/${ this.data.id }` })
            this.form = structuredClone(data)

            if(!this.form.description){
                this.form.description = this.$setForLocale()
            }
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
        }
    }

};

</script>
