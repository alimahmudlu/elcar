<template>
    <div class="d-flex flex-column flex-fill">

        <div class="d-flex flex-column flex-fill">

            <v-container class="px-3 pt-7 px-md-7">

                <v-row align="center">

                    <v-col cols="12" sm="8" md="3">
                        <v-select v-model="form.category" :label="$t('Category')"
                                  :items="categories" item-text="name" item-value="_id"
                                  outlined dense :append-icon="mdiChevronDown" :no-data-text="$t('No data')"
                                  :error-messages="$errorMessages($v.form.category, $t('Category'))"/>
                    </v-col>

                    <v-col cols="12" sm="4" md="3">
                        <v-select v-model="form.brand" :label="$t('Brand')"
                                  :items="brands" item-text="name" item-value="_id"
                                  outlined dense :append-icon="mdiChevronDown" :no-data-text="$t('No data')"
                                  :error-messages="$errorMessages($v.form.brand, $t('Brand'))"
                                  @change="form.model = null"/>
                    </v-col>

                    <v-col cols="12" sm="4" md="3">
                        <v-select v-model="form.model" :label="$t('Model')"
                                  :items="models" item-text="name" item-value="_id"
                                  outlined dense :append-icon="mdiChevronDown" :no-data-text="$t('No data')"
                                  :error-messages="$errorMessages($v.form.model, $t('Model'))"/>
                    </v-col>

                    <v-col>
                        <v-text-field v-model.number.trim="form.price" :label="$t('Price')"
                                      type="number" outlined dense suffix="₼"
                                      :error-messages="$errorMessages($v.form.price, $t('Price'))"/>
                    </v-col>

                    <v-col>
                        <v-text-field v-model.number.trim="form.discount" :label="$t('Discount')"
                                      type="number" outlined dense suffix="%" min="0" max="100"
                                      :error-messages="$errorMessages($v.form.discount, $t('Discount'))"/>
                    </v-col>

                </v-row>

                <v-row>

                    <v-col cols="12" md="9" v-for="locale in $i18n.locales" :key="`description-locale-${locale.code}`"
                           v-show="locale.code === $activeLocale()">
                        <v-textarea v-model="form.description[locale.code]" :label="$t('Description')"
                                    :error-messages="$errorMessages($v.form.description[locale.code], $t('Description'))"
                                    outlined counter rows="5" cols="30"/>
                    </v-col>

                    <v-col cols="12" md="3">
                        <MediaMenu v-model="form.image" :title="$t('Choose _', {n: $t('Photo')})"
                                   :upload="false" :multiple="false" size="6"
                                   :error-messages="$errorMessages($v.form.image, $t('Photo'))"/>
                    </v-col>

                </v-row>

            </v-container>

            <div v-for="(group, i) in form.characteristicGroups" :key="`characteristic-groups-${i}`">

                <v-card tile flat :color="$dark() ? '' : 'lighten'" class="sticky top-15 z-index-2">
                    <v-container class="px-md-7 py-3 d-flex align-center justify-space-between">

                        <span v-text="getGroup(group.group).name" class="font-weight-bold text-body-1 d-block"/>

                        <v-tooltip left>
                            <template #activator="{ on, attrs }">

                                <v-btn icon @click="group.visible = !group.visible" v-bind="attrs" v-on="on">
                                    <Icon :name="group.visible ? 'mdiEye' : 'mdiEyeOff'"/>
                                </v-btn>

                            </template>
                            {{ $t(group.visible ? 'Hide group' : 'Show group') }}
                        </v-tooltip>

                    </v-container>
                </v-card>

                <v-container class="px-md-7 pt-3 pt-md-7" v-if="group.visible">

                    <v-row align="center">
                        <v-col cols="12" sm="4" v-for="(char, c) in group.characteristics"
                               :key="`characteristic-${c}`">

                            <template v-if="charComponent(char.item).component === 'VTextField'">

                                <template v-if="charComponent(char.item).attrs.type === 'number'">
                                    <v-text-field v-model.number.trim="char.value" min="0"
                                                  :label="$t(charComponent(char.item).label)"
                                                  dense outlined v-bind="charComponent(char.item).attrs"
                                                  :append-outer-icon="!char.visible ? mdiEyeOff : mdiEye"
                                                  @click:append-outer="char.visible = !char.visible"
                                                  @input="char[charComponent(char.item).key] = char.value"/>
                                </template>

                                <template v-else>


                                    <template v-if="charComponent(char.item).attrs.translatable">
                                        <div v-for="locale in $i18n.locales" :key="`characteristic-${c}-locale-${locale.code}`"
                                             v-show="locale.code === $activeLocale()">

                                            <v-text-field v-model="char.value[locale.code]"
                                                          :label="$t(charComponent(char.item).label)" :suffix="locale.code"
                                                          dense outlined v-bind="charComponent(char.item).attrs"
                                                          :append-outer-icon="!char.visible ? mdiEyeOff : mdiEye"
                                                          @click:append-outer="char.visible = !char.visible"
                                                          @input="char[charComponent(char.item).key][locale.code] = char.value[locale.code]"/>
                                        </div>
                                    </template>

                                    <v-text-field v-model="char.value"
                                                  :label="$t(charComponent(char.item).label)"
                                                  dense outlined v-bind="charComponent(char.item).attrs"
                                                  :append-outer-icon="!char.visible ? mdiEyeOff : mdiEye"
                                                  @click:append-outer="char.visible = !char.visible" v-else
                                                  @input="char[charComponent(char.item).key] = char.value"/>

                                </template>

                            </template>

                            <template v-else-if="charComponent(char.item).component === 'VCheckbox'">
                                <v-checkbox v-model="char.value" v-bind="charComponent(char.item).attrs"
                                            :off-icon="mdiCheckboxBlankOutline" :on-icon="mdiCheckboxMarked"
                                            class="ma-0 pa-0" @change="char[charComponent(char.item).key] = char.value">
                                    <template #label>
                                        <small v-text="$t(charComponent(char.item).label)"/>
                                    </template>
                                </v-checkbox>
                            </template>

                            <template v-else>
                                <v-select v-model="char.value" :label="$t(charComponent(char.item).label)"
                                          :items="charOptions(char.item)" item-text="name" item-value="_id"
                                          dense outlined clearable :clear-icon="mdiClose" :append-icon="mdiChevronDown"
                                          :append-outer-icon="!char.visible ? mdiEyeOff : mdiEye"
                                          v-bind="charComponent(char.item).attrs" :no-data-text="$t('No data')"
                                          @click:append-outer="char.visible = !char.visible"
                                          @change="char[charComponent(char.item).key] = char.value">

                                    <template #item="{ active, item, attrs, on }" v-if="charComponent(char.item).attrs.multiple">
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
                            </template>

                        </v-col>
                    </v-row>

                    <v-row>

                        <v-col v-if="getGroup(group.group).hasDescription" v-for="locale in $i18n.locales"
                               :key="`group-${i}-description-locale-${locale.code}`"
                               v-show="locale.code === $activeLocale()">
                            <Editor v-model="group.description[locale.code]" :height="200" :locale="locale.code"/>
                        </v-col>

                        <v-col cols="12" :md="getGroup(group.group).photo.multiple ? 12 : 3"
                               v-if="getGroup(group.group).photo.display">
                            <MediaMenu v-model="group.image" :title="$t('Choose _', {n: $t('Photo')})" size="6"
                                       :upload="false" :multiple="getGroup(group.group).photo.multiple"/>
                        </v-col>

                    </v-row>

                </v-container>
                <v-divider v-else/>

            </div>

        </div>

        <v-card tile elevation="16" class="sticky bottom-0 z-index-2">
            <v-container class="px-md-7 py-3 d-flex align-center justify-space-between">

                <DeleteButton :api="`${api}/${form._id}`" :callback="()=> $router.go(-1)" class="mr-3 mr-sm-6"
                              v-if="form._id && $can('delete', `${$appModule().key}-${component.options.section}`)"/>

                <v-checkbox v-model="form.top" :label="$t('Add to slider')" class="ma-0 pa-0" hide-details
                            :off-icon="mdiCheckboxBlankOutline" :on-icon="mdiCheckboxMarked"/>

                <v-spacer/>

                <SaveButton :api="api" :alert="true" :form="form" :validation="$v.form" :callback="goToList"/>

            </v-container>
        </v-card>

    </div>
</template>

<script>

import {
    mdiChevronDown,
    mdiEyeOff,
    mdiEye,
    mdiClose,
    mdiCheckboxBlankOutline,
    mdiCheckboxMarked
} from '@mdi/js'

import { validationMixin } from 'vuelidate'
import { required, minLength, maxLength, minValue, maxValue } from 'vuelidate/lib/validators'

export default {

    name: "FormWrapper",

    mixins: [ validationMixin ],

    props: {
        component: Object,
        data: Array
    },

    data: (app) => ({

        api: 'products',

        form: {
            section: app.component.options.section,
            category: null,
            brand: null,
            model: null,
            image: null,
            price: null,
            discount: null,
            discountedPrice: null,
            top: false,
            description: app.$setForLocale(),
            characteristicGroups: []
        },

        formModel: {
            checkbox: {
                component: 'VCheckbox'
            },
            input: {
                component: 'VTextField'
            },
            select: {
                component: 'VSelect'
            }
        },

        loading: false,

        mdiChevronDown,
        mdiEyeOff,
        mdiEye,
        mdiClose,
        mdiCheckboxBlankOutline,
        mdiCheckboxMarked,
    }),

    validations() {
        return {
            form: {
                category: {
                    required
                },
                brand: {
                    required
                },
                model: {
                    required
                },
                price: {
                    required
                },
                discount: {
                    minValue: minValue(0),
                    maxValue: maxValue(100),
                },
                image: {
                    required
                },
                description: this.$setForLocale({
                    required,
                    minLength: minLength(130),
                    maxLength: maxLength(170)
                }),
            }
        }
    },

    async fetch() {
        await this.getData()
    },

    computed: {

        categories() {
            return this.$store.state.data.categories
        },

        brands() {
            return this.$store.state.data.brands
        },

        models() {
            return this.$store.state.data.allModels?.filter(model => model.brand._id === this.form.brand)
        },

        characteristics() {
            return structuredClone(this.$store.state.data.allCharacteristics)
        },

        characteristicGroups() {
            const groups = this.$store.state.data['characteristic-groups']?.filter(group => group.section === this.component.options.section)
            return structuredClone(groups)
        },

    },

    watch:{
        form:{
            deep: true,
            handler(){
                this.form.discountedPrice = this.form.discount ? this.form.price - (this.form.price * this.form.discount / 100) : this.form.price
            }
        }
    },

    methods: {

        async getData() {

            const section = this.component.options.section

            await Promise.all([
                this.$fetchData({
                    store: 'data',
                    api: 'categories',
                    query: {
                        section
                    },
                    force: true
                }),
                this.$fetchData({
                    store: 'data',
                    api: 'brands',
                    query: {
                        sections: section
                    },
                    force: true
                }),
                this.$fetchData({
                    store: 'data',
                    api: 'models',
                    key: 'allModels',
                    query: {
                        section,
                        noPagination: 1
                    },
                    force: true
                }),
                this.$fetchData({
                    store: 'data',
                    api: 'characteristic-groups',
                    query: {
                        section
                    },
                    force: true
                }),
                this.$fetchData({
                    store: 'data',
                    api: 'characteristics',
                    key: 'allCharacteristics',
                    query: {
                        section,
                        noPagination: 1
                    },
                    force: true
                }),
                this.$fetchData({
                    store: 'data',
                    api: 'characteristic-options',
                    query: {
                        noPagination: 1
                    },
                    force: true
                })
            ])

            this.setForm()

            const copy = this.$route.query.copy
            const detail = this.$route.params.detail || copy

            if (detail) {
                const data = await this.$fetchData({ api: `${ this.api }/${ detail }` })
                this.form = structuredClone(data)
                if(copy) {delete this.form._id}
                this.fillForm()
            }

        },

        setForm() {

            const characteristicGroups = structuredClone(this.characteristicGroups)

            characteristicGroups.forEach(group => {

                group.group = group._id
                group.description = this.$setForLocale()
                group.image = null
                group.characteristics = []
                group.visible = true

                delete group.photo
                delete group.name
                delete group.section
                delete group.hasDescription

                this.characteristics.forEach(char => {

                    if (char.group === group._id) {

                        const translatable = char.component?.attrs?.translatable

                        group.characteristics.push({
                            item: char._id,
                            value:  translatable ? this.$setForLocale() : null,
                            [char[this.charComponent(char._id).key]]: translatable ? this.$setForLocale() : null,
                            visible: true,
                        })
                    }
                })

                delete group._id
            })

            this.form.characteristicGroups = characteristicGroups

        },

        fillForm() {

            const characteristicGroups = structuredClone(this.characteristicGroups)

            characteristicGroups.forEach(group => {

                const formCharGroup = this.form.characteristicGroups.find(g => g.group === group._id)

                if (!formCharGroup) {
                    this.form.characteristicGroups.push({
                        group: group._id,
                        description: this.$setForLocale(),
                        image: null,
                        characteristics: this.characteristicsByGroup(group._id).map(char => {

                            const translatable = char.component?.attrs?.translatable

                            return {
                                item: char._id,
                                value:  translatable ? this.$setForLocale() : null,
                                [char[this.charComponent(char._id).key]]: translatable ? this.$setForLocale() : null,
                                visible: true,
                            }
                        })
                    })
                }

            })

            this.form.characteristicGroups.forEach(group => {
                group.characteristics = this.characteristicsByGroup(group.group).map(char => {
                    const formChar = group.characteristics.find(c => c.item === char._id)
                    const translatable = char.component?.attrs?.translatable

                    if(formChar){
                        formChar[this.charComponent(char._id).key] = formChar.value
                        return formChar
                    }else{
                        return {
                            item: char._id,
                            value:  translatable ? this.$setForLocale() : null,
                            [char[this.charComponent(char._id).key]]: translatable ? this.$setForLocale() : null,
                            visible: true
                        }
                    }

                })
            })

        },

        getGroup(id) {
            return this.characteristicGroups.find(group => group._id === id)
        },

        characteristicsByGroup(group) {
            return this.$store.state.data.allCharacteristics.filter(char => char.group === group)
        },

        characteristicById(id) {
            return this.$store.state.data.allCharacteristics.find(char => char._id === id)
        },

        charOptions(id) {
            return this.$store.state.data['characteristic-options']?.filter(option => option.characteristic._id === id)
        },

        charComponent(id) {

            const characteristic = this.characteristicById(id)

            return {
                label: characteristic.name,
                key: characteristic.key,
                ...this.formModel[characteristic.component.name],
                attrs: characteristic.component.attrs
            }
        },

        async goToList(data) {

            const routeName = this.$routeName().replace('-add', '-detail')

            setTimeout(() => this.$replacePath(this.$localePath({
                name: routeName,
                params: { detail: data._id }
            })), 300)

        }

    }

}
</script>
