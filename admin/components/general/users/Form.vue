<template>
    <v-card tile class="d-flex flex-column fill-height">

        <div class="elevation-1 d-flex justify-space-between align-center z-index-2 pr-4">

            <v-card-title class="pa-2 pl-md-4 py-md-3 font-weight-bold">

                <Icon :name="data && data._id ? 'mdiPencil' : 'mdiPlus'" left/>

                {{ $t(data && data._id ? 'Edit' : 'Add') }}

            </v-card-title>

            <v-btn icon @click="$emit('close')">
                <Icon name="mdiClose"/>
            </v-btn>

        </div>

        <div class="flex-fill px-6 pt-6 overflow-auto">
            <v-row>

                <v-col cols="12" sm="4" md="3">
                    <MediaMenu v-model="form.photo" :title="$t('Choose _', {n: $t('Photo')})"
                               :app-id="$appModule('general')._id" :dimensions="[200,200]"
                               :size="12" :upload="false" :multiple="false"/>
                </v-col>

                <v-col cols="12" sm="8" md="9">
                    <v-row align="center">

                        <template v-if="$isRoot()">

                            <v-col cols="12" sm="6">
                                <v-text-field v-model="form.company" :label="$t('Company')" outlined dense counter/>
                            </v-col>

                            <v-col cols="12" md="6">
                                <v-select v-model="form.type" :label="$t('Type')" outlined dense
                                          :items="workspaceTypes" item-text="name" item-value="_id"
                                          :append-icon="mdiChevronDown"/>
                            </v-col>
                        </template>

                        <v-col cols="12" md="6">
                            <v-text-field v-model="form.name" :label="$t('Name')"
                                          :error-messages="$errorMessages($v.form.name, $t('Name'))"
                                          outlined dense counter/>
                        </v-col>

                        <v-col cols="12" md="6">
                            <v-text-field v-model="form.surname" :label="$t('Surname')"
                                          :error-messages="$errorMessages($v.form.surname, $t('Surname'))"
                                          outlined dense counter/>
                        </v-col>

                        <v-col cols="12" md="6">
                            <v-text-field v-model="form.email" :label="$t('Email')"
                                          :error-messages="$errorMessages($v.form.email, $t('Email'))"
                                          outlined dense counter type="email"/>
                        </v-col>

                        <!--                        <v-col cols="12" sm="6">
                                                    <v-text-field v-model="form.phone" :label="$t('Phone')"
                                                                  outlined dense counter type="tel"/>
                                                </v-col>-->

                        <v-col cols="12" md="6">
                            <v-select v-model="form.role" :label="$t('Role')" outlined dense
                                      :items="roles" item-text="name" item-value="key" :append-icon="mdiChevronDown"
                                      :error-messages="$errorMessages($v.form.role, $t('Role'))"
                                      :disabled="!$can('update', 'general-users')"/>
                        </v-col>

                        <v-col cols="12" md="12">
                            <autocomplete v-model="form.modules" :label="$t('Modules')" multiple chips small-chips
                                          :items="appModules" item-text="name" item-value="_id"
                                          :disabled="form.id === $auth.user._id"/>
                        </v-col>

                        <template v-if="changePassword || !data">

                            <v-col cols="12" md="6">
                                <v-text-field v-model="form.newPassword" :label="$t('New password')"
                                              :error-messages="$errorMessages($v.form.newPassword, $t('New password'))"
                                              outlined dense counter type="password"/>
                            </v-col>

                            <v-col cols="12" md="6">
                                <v-text-field v-model="form.passwordConfirmation" :label="$t('Password confirmation')"
                                              :error-messages="$errorMessages($v.form.passwordConfirmation, $t('Password confirmation'))"
                                              outlined dense counter type="password"/>
                            </v-col>

                        </template>

                        <v-col cols="12">
                            <v-divider class="mb-6"/>
                        </v-col>

                        <v-col cols="12" md="6" v-if="data">
                            <v-switch v-model="changePassword" :label="$t('Change password')" color="primary"
                                      class="ma-0 pa-0" @change="resetPassword"/>
                        </v-col>

                        <v-col cols="12" md="6" class="ml-auto">
                            <v-text-field v-model="form.password" :label="$t('Your current password')"
                                          outlined dense counter type="password"
                                          :error-messages="$errorMessages($v.form.password, $t('Your current password'))"/>
                        </v-col>

                    </v-row>

                </v-col>

            </v-row>

        </div>

        <div class="d-flex justify-end pa-3 px-md-7 elevation-6 z-index-1">
            <SaveButton :api="api" :alert="true" :form="form" :validation="$v.form" :callback="close"/>
        </div>

    </v-card>
</template>

<script>

import { mdiChevronDown, mdiClose, mdiCheckboxMarked, mdiCheckboxBlankOutline } from '@mdi/js';

import { validationMixin } from 'vuelidate';
import { required, requiredIf, minLength, maxLength, email, sameAs } from 'vuelidate/lib/validators';
import Autocomplete from "~/components/common/form/Autocomplete";

export default {
    name: 'UsersFormWrapper',
    components: { Autocomplete },
    mixins: [ validationMixin ],

    props: {
        component: Object,
        data: Object
    },

    data: (app) => ({

        api: 'users',

        form: {
            name: null,
            surname: null,
            email: null,
            phone: null,
            role: null,
            photo: null,
            company: app.$auth.user.currentAccess.workspace?.name,
            workspace: app.$auth.user.currentAccess.workspace?._id,
            modules: []
        },

        changePassword: !app.data,
        loading: false,

        mdiChevronDown,
        mdiClose,
        mdiCheckboxMarked,
        mdiCheckboxBlankOutline,

    }),

    validations() {
        return {
            form: {
                name: {
                    required,
                    minLength: minLength(3),
                    maxLength: maxLength(20)
                },
                surname: {
                    required,
                    minLength: minLength(3),
                    maxLength: maxLength(20)
                },
                email: {
                    email,
                    required,
                },
                role: {
                    required,
                },
                password: {
                    required,
                    minLength: minLength(6),
                    maxLength: maxLength(20),
                },
                newPassword: {
                    requiredIf: requiredIf(function () {
                        return this.canChangePassword;
                    }),
                    minLength: function (value) {
                        return this.canChangePassword ? minLength(6)(value) : minLength(false);
                    },
                    maxLength: function (value) {
                        return this.canChangePassword ? maxLength(20)(value) : maxLength(false);
                    },
                },
                passwordConfirmation: {
                    requiredIf: requiredIf(function () {
                        return this.canChangePassword;
                    }),
                    sameAs: sameAs('newPassword'),
                },
            }
        };
    },

    async created() {
        await this.getData();
    },

    computed: {

        appModules() {
            return this.$store.state.appModules?.filter(app => app.key !== 'general') || [];
        },

        generalModule() {
            return this.$store.state.appModules?.find(app => app.key === 'general');
        },

        workspaceTypes() {
            return this.$store.state.data.workspaceTypes;
        },

        roles() {
            return this.$store.state.data.roles;
        },

        canChangePassword() {
            return this.changePassword && this.data || !this.data;
        }
    },

    methods: {

        async getData() {

            if (this.data) {

                const data = structuredClone(this.data);
                data.role = data.currentAccess?.role.key;

                if (this.$isRoot()) {
                    data.company = data.currentAccess?.workspace?.name;
                }

                data.modules = data.currentAccess?.permissions.filter(per => per.module !== this.generalModule._id).map(per => per.module);

                delete data.accessList;
                delete data.currentAccess;
                delete data.defaultAccess;

                this.form = data;
                this.form.id = data._id;
            }

            await this.$fetchData({
                store: 'data',
                api: 'roles',
                query: {
                    filter: {
                        key: { $nin: [ 'root' ] }
                    }
                }
            });

            if(this.$isRoot()){
                await this.$fetchData({
                    store: 'data',
                    api: 'workspace-types',
                    key: 'workspaceTypes'
                });
            }
        },

        close() {
            this.$emit('close');
            this.$reFetch();
            if (this.data && this.$auth.user._id === this.data._id) {
                this.$auth.fetchUser();
            }
        },

        resetPassword() {

            if (this.changePassword) {
                this.$set(this.form, 'password', null);
                this.$set(this.form, 'newPassword', null);
                this.$set(this.form, 'passwordConfirmation', null);
            } else {
                delete this.form.password;
                delete this.form.newPassword;
                delete this.form.passwordConfirmation;
            }

            this.$v.form.$reset();
        }

    }
};
</script>
