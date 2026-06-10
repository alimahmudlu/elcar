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
                      :items="sections" item-text="name" item-value="key" outlined dense
                      :append-icon="mdiChevronDown" :no-data-text="$t('No data')"
                      :error-messages="$errorMessages($v.form.section, $t('Section'))"
                      @change="form.group = null"/>

            <v-select v-model="form.group" :label="$t('Group')"
                      :items="groups" item-text="name" item-value="_id" outlined dense
                      :append-icon="mdiChevronDown" :no-data-text="$t('No data')"
                      :error-messages="$errorMessages($v.form.group, $t('Group'))"
                      @change="form.characteristic = null"/>

            <v-select v-model="form.characteristic" :label="$t('Characteristic')"
                      :items="characteristics" item-text="name" item-value="_id" outlined dense
                      :append-icon="mdiChevronDown" :no-data-text="$t('No data')"
                      :error-messages="$errorMessages($v.form.characteristic, $t('Characteristic'))"/>

            <div class="d-flex">

                <div v-for="locale in $i18n.locales" :key="`locale-${locale.code}`"
                     v-show="locale.code === $activeLocale()" class="fill-width">

                    <v-text-field v-model="form.name[locale.code]" :label="$t('Name')" required outlined dense
                                  :error-messages="$errorMessages($v.form.name[locale.code], $t('Name'))"/>

                </div>

                <ChangeContentLocale class="ml-2"/>

            </div>

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

    name: 'CharacteristicOptionsForm',

    mixins: [ validationMixin ],

    props: {
        data: Object,
    },

    data: (app) => ({

        api: 'characteristic-options',

        form: {
            section: null,
            group: null,
            characteristic: null,
            name: app.$setForLocale(),
        },

        mdiClose,
        mdiChevronDown

    }),

    validations() {
        return {
            form: {
                section: {
                    required,
                },
                group: {
                    required,
                },
                characteristic: {
                    required,
                },
                name: this.$setForLocale({
                    required,
                    minLength: minLength(1)
                }),
            },
        }
    },

    async created() {
        await this.getData()
    },

    computed: {

        sections() {
            return this.$store.state.data.productSections
        },

        groups() {
            const groups = this.$store.state.data['characteristic-groups']
            return groups?.filter(group => group.section === this.form.section)
        },

        characteristics() {
            const characteristics = this.$store.state.data.allCharacteristics
            return characteristics?.filter(char => char.group === this.form.group && char.component.name === 'select')
        }
    },

    methods: {

        async getData() {

            if (this.data.id) {

                const data = await this.$fetchData({
                    api: `${ this.api }/${ this.data.id }`,
                    query: {
                        section: this.data.section
                    }
                })

                this.form = structuredClone(data)
            }

            await Promise.all([
                this.$fetchData({
                    store: 'data',
                    api: 'characteristic-groups',
                }),
                this.$fetchData({
                    store: 'data',
                    api: 'characteristics',
                    key: 'allCharacteristics',
                    query: {
                        noPagination: 1
                    }
                })
            ])
        },

        close() {
            this.$emit('close')
            this.$reFetch()
        }
    }

};

</script>
