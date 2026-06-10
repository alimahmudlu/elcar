<template>
    <v-card tile class="d-flex flex-column fill-height">

        <div class="elevation-1 d-flex justify-space-between align-center z-index-2 pr-4">

            <v-card-title class="pa-2 pl-md-4 py-md-3 font-weight-bold">
                {{ $t( 'Users and permissions' ) }}
            </v-card-title>

            <v-btn icon @click="$emit('close')">
                <Icon name="mdiClose"/>
            </v-btn>

        </div>

        <div class="flex-fill overflow-auto">

<!--            <div class="pa-3 pa-md-7">

                <div class="text-center">

                    <v-btn tag="span" icon width="80" height="80" color="primary" class="v-btn&#45;&#45;active rounded-circle mb-4">
                        <Icon name="mdiAccountGroup" large/>
                    </v-btn>

                    <h2 class="font-weight-bold text-body-1" v-text="$t('Invite new users')"/>

                    <p class="text&#45;&#45;secondary text-body-2 mb-6" v-text="$t('Send invitation to other users')"/>

                </div>

                <v-row dense v-for="(invitation, i) in invitations" :key="`new-invitation-${i}`">

                    <v-col cols="12" sm="7">
                        <v-text-field v-model="invitation.email" :label="$t('Email')" type="email" required outlined dense
                                      :error-messages="$errorMessages($v.invitations.$each[i].email, $t('Email'))"/>
                    </v-col>

                    <v-col cols="12" sm="5">
                        <v-select v-model="invitation.role" :items="roles" item-text="name" item-value="_detail"
                                  :label="$t('Role')" required outlined dense :append-icon="mdiChevronDown"
                                  :error-messages="$errorMessages($v.invitations.$each[i].role, $t('Role'))">
                            <template #append-outer>

                                <v-tooltip top>
                                    <template #activator="{ on, attrs }">
                                        <v-btn fab x-small depressed class="mt-n1 grey&#45;&#45;text" v-bind="attrs" v-on="on"
                                               :title="$t('Modules')" @click="toggleModules(i)">
                                            <Icon name="mdiWidgetsOutline"/>
                                        </v-btn>
                                    </template>
                                    {{ $t('Modules') }}
                                </v-tooltip>

                                <v-tooltip top v-if="i !== 0">
                                    <template #activator="{ on, attrs }">
                                        <v-btn fab x-small depressed class="mt-n1 red&#45;&#45;text ml-1" v-bind="attrs" v-on="on"
                                               :title="$t('Modules')" @click="invitations.splice(i, 1)">
                                            <Icon name="mdiClose"/>
                                        </v-btn>
                                    </template>
                                    {{ $t('Delete') }}
                                </v-tooltip>

                            </template>
                        </v-select>
                    </v-col>

                    <v-col cols="12" class="mb-7" v-if="invitationsPanel.includes(i)">
                        <v-card rounded="lg" flat color="lighten" class="px-4 py-1">

                            <template v-for="(module, m) in modules">
                                <v-checkbox v-model="invitation.modules" :label="$byLocale(module.name)" multiple
                                            :off-icon="mdiCheckboxBlankOutline" :on-icon="mdiCheckboxMarked"
                                            :value="module._detail" hide-details class="my-2"
                                            :readonly="invitation.modules.length === 1 && invitation.modules.includes(module._detail)"/>
                            </template>

                        </v-card>
                    </v-col>

                </v-row>

                <div class="d-flex justify-space-between align-center">

                    <v-btn small rounded text @click="addInvitation">
                        <Icon name="mdiPlus" left/>
                        {{ $t('Add _', {n: $t('User')}) }}
                    </v-btn>

                    <SaveButton api="user-invitations" :form="invitations" :validation="$v.invitations"
                                :callback="getInvitations" small :text="$t('Invite')"/>

                </div>

            </div>

            <div class="lighten">

                <template v-if="data.project">

                    <div class="pa-3 pa-md-7 pt-0 pt-md-0">

                        <v-subheader v-text="$t('Project owner')"/>

                        <v-card rounded="lg" elevation="3" class="pa-3 d-flex justify-space-between align-center">

                            <span class="d-flex align-center">

                                <v-avatar :color="data.project.createdBy.color || 'primary'" size="36">

                                    <img v-if="data.project.createdBy.avatar" :src="data.project.createdBy.avatar" width="24"
                                         height="24" :alt="`${data.project.createdBy.name} ${data.project.createdBy.surname}`"/>

                                    <small v-else class="white&#45;&#45;text font-weight-bold"
                                           v-text="$nameInitials(`${data.project.createdBy.name} ${data.project.createdBy.surname}`)"/>

                                </v-avatar>

                                <span class="font-weight-bold pl-3 text-body-2"
                                      v-text="`${data.project.createdBy.name} ${data.project.createdBy.surname}`"/>

                            </span>

                            <v-btn tag="span" small rounded text color="primary" class="v-btn&#45;&#45;active">
                                {{ $t('Owner') }}
                            </v-btn>

                        </v-card>

                    </div>

                    <v-divider/>

                    <div class="pa-3 pa-md-7 pt-0 pt-md-0" v-if="data.project.assignees.length">

                        <v-subheader v-text="$t('Assignees')"/>

                        <v-card rounded="lg" elevation="3" class="pa-3 mb-3 d-flex justify-space-between align-center"
                                v-for="(user, i) in data.project.assignees" :key="`assignee-${i}`">

                            <span class="d-flex align-center">

                                <v-avatar :color="user.color || 'primary'" size="36">

                                    <img v-if="user.avatar" :src="user.avatar" width="24"
                                         height="24" :alt="`${user.name} ${user.surname}`"/>

                                    <small v-else class="white&#45;&#45;text font-weight-bold"
                                           v-text="$nameInitials(`${user.name} ${user.surname}`)"/>

                                </v-avatar>

                                <span class="font-weight-bold pl-3 text-body-2"
                                      v-text="`${user.name} ${user.surname}`"/>

                            </span>

                            <v-btn tag="span" small rounded text color="primary" class="v-btn&#45;&#45;active">
                                {{ $t(user.currentAccess.role.name) }}
                            </v-btn>

                        </v-card>

                    </div>

                </template>

                <template v-if="pendingInvitations.length">

                    <v-divider/>

                    <div class="pa-3 pa-md-7 pt-0 pt-md-0">

                        <v-subheader v-text="$t('Pending invitations')"/>

                        <v-expansion-panels v-model="pendingInvitationsPanel" multiple>
                            <v-expansion-panel v-for="(invitation, i) in pendingInvitations" :key="`pending-invitation-${i}`"
                                               class="rounded-lg elevation-3 mb-3">

                                <v-expansion-panel-header class="pa-3" :expand-icon="mdiChevronDown">

                                    <span class="d-flex align-center fill-width">

                                        <v-avatar color="primary" size="36">
                                            <Icon name="mdiAccount" dark size="20"/>
                                        </v-avatar>

                                        <span class="font-weight-bold pl-3 text-body-2" v-text="invitation.email"/>

                                    </span>

                                    <span class="pr-3">
                                        <v-chip small v-text="$t(invitation.role.name)" color="primary"/>
                                    </span>

                                </v-expansion-panel-header>

                                <v-expansion-panel-content>
                                    <div class="pt-4 text-body-2 mx-n2 border-top">

                                        <v-simple-table class="border mb-4">
                                            <template #default>
                                                <tbody>

                                                <tr>
                                                    <th class="text-left text-no-wrap" v-text="$t('Invited by')"/>

                                                    <td v-text="`${invitation.createdBy.name} ${invitation.createdBy.surname}`"/>
                                                </tr>

                                                <tr>
                                                    <th class="text-left text-no-wrap" v-text="$t('Modules')"/>

                                                    <td class="py-1">
                                                        <v-chip v-for="(module, m) in invitation.modules" small class="ml-2 my-1"
                                                                :key="`invitation-${i}-module-${m}`" v-text="module.name"/>
                                                    </td>
                                                </tr>

                                                <tr>
                                                    <th class="text-left text-no-wrap" v-text="$t('Created at')"/>

                                                    <td v-text="$dayjs(invitation.createdAt).format('DD MMMM YYYY, hh:mm')"/>
                                                </tr>

                                                </tbody>
                                            </template>
                                        </v-simple-table>

                                        <div class="text-end">
                                            <v-btn small rounded text color="red" class="v-btn&#45;&#45;active">
                                                {{ $t('Delete') }}
                                            </v-btn>
                                        </div>

                                    </div>
                                </v-expansion-panel-content>

                            </v-expansion-panel>
                        </v-expansion-panels>

                    </div>

                </template>

            </div>-->

        </div>

    </v-card>
</template>

<script>

import { validationMixin } from 'vuelidate';
import { required, email } from 'vuelidate/lib/validators';
import { mdiChevronDown, mdiCheckboxBlankOutline, mdiCheckboxMarked } from '@mdi/js';

export default {

    name: 'DatasetForm',

    mixins: [ validationMixin ],

    props: {
        data: Object,
    },

    data: ( app ) => ( {
        invitations: [],

        invitationsPanel: [],
        pendingInvitationsPanel: [],
        assigneesPanel: [],
        allUsersPanel: [],

        mdiChevronDown,
        mdiCheckboxBlankOutline,
        mdiCheckboxMarked
    } ),

    validations: {
        invitations: {
            $each:{
                email: {
                    email,
                    required
                },
                role: {
                    required
                }
            }
        }
    },

    mounted() {
        this.getRoles()
        this.getInvitations()
    },

    computed: {

        pendingInvitations() {
            return this.$store.state.data.pendingInvitations;
        },

        roles() {
            return this.$store.state.data.roles;
        },

        permissions() {
            return this.$auth.user.currentAccess.permissions;
        },

        modules() {
            return this.permissions.map( permission => permission.module );
        },

        moduleId() {
            return this.modules.map( module => module._id );
        }
    },

    methods: {

        async getRoles(){
            await this.$fetchData({
                store: 'data',
                api: 'roles',
                query:{
                    filter: {
                        key: {$ne: 'owner'}
                    }
                },
                key: 'roles'
            })
        },

        async getInvitations(){

            const query = {
                workspace: this.$auth.user.currentAccess.workspace._id,
                status: 'pending'
            }

            if(this.$route.params.folder){
                query.folder = this.$route.params.project
            }

            await this.$fetchData({
                store: 'data',
                api: 'user-invitations',
                key: 'pendingInvitations',
                force: true,
                query
            })

            this.invitations = []
            this.addInvitation()
            this.$v.$reset()
        },

        addInvitation(){
            this.invitations.push({
                email: null,
                role: null,
                project: this.$route.params.project,
                workspace: this.$route.params.project,
                modules: this.moduleId,
            })
        },

        toggleModules(i){
            if(this.invitationsPanel.includes(i)){
                this.invitationsPanel = this.invitationsPanel.filter(p => p !==i)
            }else{
                this.invitationsPanel.push(i)
            }
        }
    }
};
</script>

<style lang="scss">
.v-expansion-panel {
    &::before {
        box-shadow: none !important;
    }
}
</style>
