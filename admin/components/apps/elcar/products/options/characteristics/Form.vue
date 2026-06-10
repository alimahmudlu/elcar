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

            <template>

                <v-select v-model="form.section" :label="$t('Section')" outlined dense
                          :items="sections" item-text="name" item-value="key"
                          :append-icon="mdiChevronDown" :no-data-text="$t('No data')"
                          :error-messages="$errorMessages($v.form.section, $t('Section'))"/>

                <v-select v-model="form.categories" :label="$t('Categories')" outlined dense multiple
                          :items="categories" item-text="name" item-value="_id"
                          :append-icon="mdiChevronDown" :no-data-text="$t('No data')"
                          :error-messages="$errorMessages($v.form.categories, $t('Categories'))">

                    <template #selection="{ item, index }">
                        <v-chip small v-text="item.name" class="overflow-visible"/>
                    </template>

                    <template #item="{ active, item, attrs, on }">
                        <v-list-item v-on="on" v-bind="attrs" #default="{ active }">

                            <v-list-item-action>
                                <v-checkbox :input-value="active" :on-icon="mdiCheckboxMarked" :off-icon="mdiCheckboxBlankOutline"/>
                            </v-list-item-action>

                            <v-list-item-content>
                                <v-list-item-title v-text="item.name"/>
                            </v-list-item-content>

                        </v-list-item>
                    </template>

                </v-select>

                <v-select v-model="form.group" :label="$t('Group')" outlined dense
                          :items="groups" item-text="name" item-value="_id"
                          :append-icon="mdiChevronDown" :no-data-text="$t('No data')"
                          :error-messages="$errorMessages($v.form.group, $t('Group'))"/>

                <v-select v-model="form.component.name" :label="$t('Type')"
                          :items="attributeTypes" item-text="name" item-value="value"
                          outlined dense :append-icon="mdiChevronDown"
                          :no-data-text="$t('No data')" @change="setAttribute"/>

            </template>

            <div class="d-flex">

                <div v-for="locale in $i18n.locales" :key="`locale-${locale.code}`"
                     v-show="locale.code === $activeLocale()" class="fill-width">

                    <v-text-field v-model="form.name[locale.code]" :label="$t('Name')" required outlined dense
                                  :error-messages="$errorMessages($v.form.name[locale.code], $t('Name'))"/>

                </div>

                <ChangeContentLocale class="ml-2"/>

            </div>

            <template v-if="attrOptions[form.component.name].attrs.length">
                <v-row align="center" dense class="pb-3">
                    <template v-for="(attr, a) in attrOptions[form.component.name].attrs">

                        <v-col :cols="attr.col" :key="`attr-${a}`" v-if="attr && getCondition(attr.show, attr)">

                            <template v-if="Array.isArray(attr.value)">
                                <v-select v-model="form.component.attrs[attr.key]"
                                          :label="$t(attr.name)" :no-data-text="$t('No data')"
                                          :items="attr.value" item-value="value" item-text="name"
                                          outlined dense :append-icon="mdiChevronDown"
                                          @[attr.on.event]="onEvent($event, attr.on.method)"/>
                            </template>

                            <template v-else-if="attr.attrs.type === 'number'">
                                <v-text-field v-model.number.trim="form.component.attrs[attr.key]"
                                              :label="$t(attr.name)" outlined dense type="number" min="0"
                                              @input="form.component.attrs.min < 0 ? form.component.attrs.min = 0 : form.component.attrs.min"
                                              @blur="form.component.attrs.min < 0 ? form.component.attrs.min = 0 : form.component.attrs.min"/>
                            </template>

                            <template v-else-if="attr.attrs.type === 'string'">
                                <v-text-field v-model.trim="form.component.attrs[attr.key]"
                                              :label="$t(attr.name)" outlined dense/>
                            </template>

                            <template v-else-if="attr.attrs.type === 'boolean'">
                                <v-switch v-model="form.component.attrs[attr.key]" :label="$t(attr.name)"
                                          class="mt-0 mb-3 ml-3 pa-0" hide-details/>
                            </template>

                        </v-col>

                    </template>
                </v-row>
            </template>

        </div>

        <div class="d-flex justify-end pa-3 px-md-7 elevation-6 z-index-1">
            <SaveButton :api="api" :form="form" :validation="$v.form" :callback="()=> close()"/>
        </div>

    </v-card>
</template>

<script>

import { validationMixin } from 'vuelidate';
import { required, minLength } from 'vuelidate/lib/validators';
import Draggable from 'vuedraggable';
import { mdiChevronDown, mdiClose, mdiCheckboxMarked, mdiCheckboxBlankOutline } from '@mdi/js';

export default {

    name: 'AttributesForm',

    mixins: [ validationMixin ],

    components: { Draggable },

    props: {
        data: Object,
    },

    data: (app) => ({

        api: 'characteristics',

        form: {
            section: 'vehicles',
            name: app.$setForLocale(),
            categories: [],
            group: null,
            component: {
                name: null,
                attrs: null
            }
        },

        attributeTypes: [
            {
                name: 'Input',
                value: 'input',
            },
            {
                name: 'Select',
                value: 'select',
            },
            {
                name: 'Checkbox',
                value: 'checkbox',
            }
        ],

        attributesList: [
            {
                name: 'input',
                attrs: {
                    type: 'text',
                }
            },
            {
                name: 'select',
                attrs: {},
            },
            {
                name: 'checkbox',
                attrs: {}
            }
        ],

        attrOptions: {
            input: {
                attrs: [
                    {
                        name: 'Suffix',
                        key: 'suffix',
                        value: null,
                        attrs: {
                            type: 'string'
                        },
                        on: {
                            event: null,
                            method: null
                        },
                        col: 6,
                    },
                    {
                        name: 'Input type',
                        key: 'type',
                        value: [
                            {
                                name: 'Text',
                                value: 'text'
                            },
                            {
                                name: 'Number',
                                value: 'number'
                            },
                        ],
                        attrs: {
                            type: 'string'
                        },
                        on: {
                            event: 'change',
                            method: 'removeTranslatable'
                        },
                        col: 6,
                    },
                    {
                        name: 'Min length',
                        key: 'minLength',
                        value: null,
                        attrs: {
                            type: 'number'
                        },
                        on: {
                            event: null,
                            method: null
                        },
                        col: 6,
                    },
                    {
                        name: 'Max length',
                        key: 'maxLength',
                        value: null,
                        attrs: {
                            type: 'number'
                        },
                        on: {
                            event: null,
                            method: null
                        },
                        col: 6,
                    },
                    {
                        name: 'Min value',
                        key: 'minValue',
                        value: null,
                        attrs: {
                            type: 'number'
                        },
                        on: {
                            event: null,
                            method: null
                        },
                        col: 6,
                    },
                    {
                        name: 'Max value',
                        key: 'maxValue',
                        value: null,
                        attrs: {
                            type: 'number'
                        },
                        on: {
                            event: null,
                            method: null
                        },
                        col: 6,
                    },
                    {
                        name: 'Required',
                        key: 'required',
                        value: false,
                        attrs: {
                            type: 'boolean'
                        },
                        on: {
                            event: null,
                            method: null
                        },
                        col: 6,
                    },
                    {
                        name: 'Add to slug',
                        key: 'addToSlug',
                        value: false,
                        attrs: {
                            type: 'boolean'
                        },
                        on: {
                            event: null,
                            method: null
                        },
                        col: 6,
                    },
                    {
                        name: 'Show on item',
                        key: 'showOnItem',
                        value: false,
                        attrs: {
                            type: 'boolean'
                        },
                        on: {
                            event: null,
                            method: null
                        },
                        col: 6,
                    },
                    {
                        name: 'Translatable',
                        key: 'translatable',
                        value: false,
                        attrs: {
                            type: 'boolean'
                        },
                        on: {
                            event: null,
                            method: null
                        },
                        col: 6,
                        show: 'vm.form.component.attrs.type === "text"'
                    },
                ]
            },
            select: {
                attrs: [
                    {
                        name: 'Suffix',
                        key: 'suffix',
                        value: null,
                        attrs: {
                            type: 'string'
                        },
                        on: {
                            event: null,
                            method: null
                        },
                        col: 12,
                    },
                    {
                        name: 'Multiple',
                        key: 'multiple',
                        value: false,
                        attrs: {
                            type: 'boolean'
                        },
                        on: {
                            event: null,
                            method: null
                        },
                        col: 6,
                    },
                    {
                        name: 'Required',
                        key: 'required',
                        value: false,
                        attrs: {
                            type: 'boolean'
                        },
                        on: {
                            event: null,
                            method: null
                        },
                        col: 6,
                    },
                    {
                        name: 'Show on item',
                        key: 'showOnItem',
                        value: false,
                        attrs: {
                            type: 'boolean'
                        },
                        on: {
                            event: null,
                            method: null
                        },
                        col: 6,
                    },
                    {
                        name: 'Show on filter',
                        key: 'showOnFilter',
                        value: false,
                        attrs: {
                            type: 'boolean'
                        },
                        on: {
                            event: null,
                            method: null
                        },
                        col: 6,
                    },
                ]
            },
            checkbox: {
                attrs: []
            },
        },

        mdiChevronDown,
        mdiClose,
        mdiCheckboxMarked,
        mdiCheckboxBlankOutline,

    }),

    validations() {
        return {
            form: {
                name: this.$setForLocale({
                    required,
                    minLength: minLength(2)
                }),
                categories: {
                    required
                },
                group: {
                    required
                },
                section: {
                    required
                }
            },
        }
    },

    async created() {

        this.selectAttribute(0);

        if (this.data.id) {
            const data = await this.$fetchData({ api: `${ this.api }/${ this.data.id }` })

            console.log(data)
            this.form = structuredClone(data)
        }

        await Promise.all([
            this.$fetchData({
                store: 'data',
                api: 'categories',
            }),
            this.$fetchData({
                store: 'data',
                api: 'characteristic-groups',
            })
        ])
    },

    computed: {

        sections() {
            return this.$store.state.data.productSections
        },

        categories() {
            return this.$store.state.data['categories']?.filter(category => category.section === this.form.section)
        },

        groups() {
            return this.$store.state.data['characteristic-groups']?.filter(group => group.section === this.form.section)
        }
    },

    methods: {

        setAttribute() {
            const index = this.attributesList.findIndex(attr => attr.name === this.form.component.name)
            this.selectAttribute(index)
        },

        selectAttribute(i) {
            this.form.component = structuredClone(this.attributesList[i])
        },

        removeTranslatable() {
            delete this.form.component.attrs.translatable
        },

        onEvent(e, method) {
            return this[method](e);
        },
        getCondition(condition, arg) {
            const vm = this;
            return !condition || eval(condition);
        },

        close() {
            this.$emit('close')
            this.$reFetch()
        }
    }

};

</script>
