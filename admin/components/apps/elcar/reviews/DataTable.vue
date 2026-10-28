<template>
    <DataDynamicTable :api="api" :state-key="component.options.section" :headers="headers" :actions="actions">

        <template #rating="{ item }">
            <span class="text-no-wrap">{{ '★'.repeat(item.rating) }}{{ '☆'.repeat(5 - item.rating) }}</span>
        </template>

        <template #text="{ item }">
            <span class="d-inline-block text-truncate" style="max-width: 360px" :title="item.text" v-text="item.text"/>
        </template>

        <template #status="{ item }">
            <v-chip small label :color="statusColors[item.status]" text-color="white" v-text="$t(`review.${item.status}`)"/>
        </template>

    </DataDynamicTable>
</template>

<script>
export default {
    name: "ReviewsDataTable",

    props: {
        component: Object,
        data: Array
    },

    data: (app) => ({

        api: 'reviews',

        statusColors: {
            pending: 'orange',
            approved: 'green',
            hidden: 'grey'
        },

        headers: [
            { text: app.$t('Product'), value: 'productTitle', visible: true, fixed: false, sortable: false },
            { text: app.$t('Sender'), value: 'fullName', visible: true, fixed: false, sortable: false },
            { text: app.$t('Rating'), value: 'rating', visible: true, fixed: false, sortable: false },
            { text: app.$t('Review'), value: 'text', visible: true, fixed: false, sortable: false },
            { text: app.$t('Status'), value: 'status', visible: true, fixed: false, sortable: false },
            { text: app.$t('Created at'), value: 'createdAt', visible: true, fixed: false, sortable: false },
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
                name: app.$t('Approve'),
                icon: 'mdiCheckCircleOutline',
                onClick: (item) => app.setStatus(item, 'approved'),
                condition: app.$can('update', `${app.$appModule().key}-${app.component.options.section}`)
            },
            {
                name: app.$t('Hide'),
                icon: 'mdiEyeOffOutline',
                onClick: (item) => app.setStatus(item, 'hidden'),
                condition: app.$can('update', `${app.$appModule().key}-${app.component.options.section}`)
            },
            {
                name: app.$t('Delete'),
                icon: 'mdiDeleteOutline',
                onClick: (item) => app.$deleteData({
                    api: `reviews/${item._id}`,
                    callback: () => app.$reFetch()
                }),
                condition: app.$can('delete', `${app.$appModule().key}-${app.component.options.section}`)
            },
        ],
    }),

    methods: {
        // Təsdiq/gizlətmə məhsulun reytinqini API-də avtomatik yeniləyir
        async setStatus(item, status) {
            await this.$saveData({
                api: 'reviews',
                payload: { _id: item._id, status },
                alert: false
            })
            await this.$reFetch()
        }
    }
}
</script>
