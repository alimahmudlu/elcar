<template>
    <DataDynamicTable :api="api" :query="$route.query" :headers="headers" :actions="actions">

        <template #avatar="{item}">
            <v-avatar size="36" class="lighten">
                <v-img :src="item.photo ? $src(item.photo.src) : null"/>
            </v-avatar>
        </template>

        <template #fullName="{ item }">
            {{ `${ item.name } ${ item.surname }` }}
        </template>

        <template #company="{ item }">
            <v-chip color="primary" small v-text="item.currentAccess.workspace.name"
                    v-if="item.currentAccess.workspace"/>
        </template>

        <template #currentAccess="{ item }">
            <v-chip color="primary" small v-text="item.currentAccess.role.name"
                    v-if="item.currentAccess.role"/>
        </template>

    </DataDynamicTable>
</template>

<script>
export default {

    name: 'UsersDataTable',

    props: {
        component: Object,
        data: Array
    },

    data: (app) => ({

        api: 'users',

        headers: [
            { text: app.$t('Photo'), value: 'avatar', visible: true, fixed: false, sortable: false, width: 48, },
            {
                text: app.$t('Full name'),
                value: 'fullName',
                visible: true,
                fixed: false,
                sortable: false,
                class: 'text-no-wrap'
            },
            { text: app.$t('Organization'), value: 'company', visible: true, fixed: false, sortable: false, },
            { text: app.$t('Role'), value: 'currentAccess', visible: true, fixed: false, sortable: false, },
            { text: app.$t('Created at'), value: 'createdAt', visible: true, fixed: false, sortable: false },
            { text: app.$t('Updated at'), value: 'updatedAt', visible: true, fixed: false, sortable: false },
            {
                text: null,
                value: 'action',
                visible: true,
                fixed: false,
                sortable: false,
                align: 'right',
                width: 10,
                class: 'sticky right-0 px-2 border-left'
            },
        ],

        actions: [
            {
                name: app.$t('Edit'),
                icon: 'mdiPencilOutline',
                onClick: async (item) => app.$openDialog({
                    component: 'general/users/Form',
                    data: item,
                    options: {
                        width: 900,
                        sideBar: true,
                    }
                }),
                condition: (user) => {
                    return app.$can('update', 'general-users') || user._id === app.$auth.user._id;
                }
            },
            {
                name: app.$t('Delete'),
                icon: 'mdiDeleteOutline',
                onClick: async (item) => await app.$deleteData({
                    api: `${ app.api }/${ item._id }`,
                    callback: () => app.$reFetch()
                }),
                condition: (user) => {
                    return app.$can('delete', 'general-users') && user._id !== app.$auth.user._id;
                }
            }
        ],

    }),

};
</script>
