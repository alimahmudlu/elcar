<template>
    <DataDynamicTable :api="api" :state-key="component.options.section" :headers="headers" :actions="actions"/>
</template>

<script>
export default {
    name: "BlogDataTable",

    props: {
        component: Object,
        data: Array
    },

    data: (app) => ({

        api: 'blog',

        headers: [
            { text: app.$t('Title'), value: 'title', visible: true, fixed: false, sortable: false, class: 'text-no-wrap' },
            { text: app.$t('Slider'), value: 'top', visible: true, fixed: false, sortable: false, align: 'center' },
            { text: app.$t('Created at'), value: 'createdAt', visible: true, fixed: false, sortable: false },
            { text: app.$t('Updated at'), value: 'updatedAt', visible: true, fixed: false, sortable: false },
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
                name: app.$t('Edit'),
                icon: 'mdiPencilOutline',
                to: (item) => app.$localePath({
                    name: `apps-${app.$appModule().key}-blog-detail`,
                    params: { detail: item._id }
                }),
                condition: app.$can('update', `${app.$appModule().key}-${app.component.options.section}`)
            },
            {
                name: app.$t('Delete'),
                icon: 'mdiDeleteOutline',
                onClick: async (item) => await app.$deleteData({
                    api: `${ app.api }/${ item._id }`,
                    callback: () => app.$reFetch()
                }),
                condition: app.$can('delete', `${app.$appModule().key}-${app.component.options.section}`)
            }
        ],
    }),
}
</script>
