<template>
    <DataDynamicTable :api="api" :state-key="component.options.section" :headers="headers" :actions="actions"
                      :date-values="['seenAt']"/>
</template>

<script>
export default {
    name: "MessagesDataTable",

    props: {
        component: Object,
        data: Array
    },

    data: (app) => ({

        api: 'messages',

        headers: [
            { text: app.$t('Sender'), value: 'fullName', visible: true, fixed: false, sortable: false },
            { text: app.$t('Email'), value: 'email', visible: true, fixed: false, sortable: false },
            { text: app.$t('Phone'), value: 'phone', visible: true, fixed: false, sortable: false },
            { text: app.$t('Created at'), value: 'createdAt', visible: true, fixed: false, sortable: false },
            { text: app.$t('Seen'), value: 'seen', visible: true, fixed: false, sortable: false, align: 'center' },
            { text: app.$t('Seen at'), value: 'updatedAt', visible: true, fixed: false, sortable: false },
            {
                text: null,
                value: 'action',
                visible: true,
                fixed: false,
                sortable: false,
                width: 10,
                class: 'sticky right-0 px-2 border-left'
            },
        ],

        actions: [
            {
                name: app.$t('View'),
                icon: 'mdiEyeOutline',
                onClick: (item) => app.$openDialog({
                    component: `apps/${app.$appModule().key}/messages/Detail`,
                    data: item,
                    options: {
                        width: 960
                    }
                }),
                condition: app.$can('read', `${app.$appModule().key}-${app.component.options.section}`)
            },
        ],
    }),
}
</script>
