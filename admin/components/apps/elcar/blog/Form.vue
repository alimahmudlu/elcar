<template>
    <div class="d-flex flex-column flex-fill">

        <v-container class="px-3 pt-7 px-md-7 flex-fill">
            <v-row>

                <v-col cols="12" md="9" v-for="locale in $i18n.locales" :key="`description-locale-${locale.code}`"
                       v-show="locale.code === $activeLocale()">

                    <v-text-field v-model.number.trim="form.title[locale.code]" :label="$t('Title')" outlined dense
                                  :error-messages="$errorMessages($v.form.title[locale.code], $t('Title'))" counter/>

                    <v-textarea v-model="form.description[locale.code]" :label="$t('Description')"
                                :error-messages="$errorMessages($v.form.description[locale.code], $t('Category'))"
                                outlined rows="3" cols="30" counter/>

                    <Editor v-model="form.content[locale.code]" :label="$t('Content')" :locale="locale.code"
                            :error-messages="$errorMessages($v.form.content[locale.code], $t('Content'))"/>
                </v-col>

                <v-col cols="12" md="3">
                    <MediaMenu v-model="form.image" :title="$t('Choose _', {n: $t('Photo')})"
                               :upload="false" :multiple="false" size="6"
                               :error-messages="$errorMessages($v.form.image, $t('Photo'))"/>
                </v-col>

            </v-row>

        </v-container>

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
import { required, minLength, maxLength } from 'vuelidate/lib/validators'

export default {
    name: "FormWrapper",

    mixins: [ validationMixin ],

    props: {
        component: Object,
        data: Array
    },

    data: (app) => ({

        api: 'blog',

        form: {
            title: app.$setForLocale(),
            description: app.$setForLocale(),
            content: app.$setForLocale(),
            image: null,
            top: false,
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
                title: this.$setForLocale({
                    required,
                    minLength: minLength(30),
                    maxLength: maxLength(70)
                }),
                description: this.$setForLocale({
                    required,
                    minLength: minLength(130),
                    maxLength: maxLength(170)
                }),
                content: this.$setForLocale({
                    required,
                    minLength: minLength(300)
                }),
                image: {
                    required,
                }
            }
        }
    },

    async fetch() {
        await this.getData()
    },

    methods: {

        async getData() {

            const detail = this.$route.params.detail

            if (detail) {
                const data = await this.$fetchData({ api: `${this.api}/${ detail }` })
                this.form = structuredClone(data)
            }

        },

        async goToList(data) {

            const routeName = this.$routeName().replace('-add', '-detail')

            setTimeout(()=> this.$replacePath(this.$localePath({
              name: routeName,
              params: { detail: data._id }
            })), 300)

        }

    }
}
</script>
