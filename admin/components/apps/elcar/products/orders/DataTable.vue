<template>
    <DataDynamicTable :api="api" :query="query" :state-key="component.options.section" :headers="headers"
                      :actions="actions">

        <template #totalAmount="{ item }">
            <v-chip color="lighten">
                {{ totalAmount(item) }}
            </v-chip>
        </template>

        <template #totalCost="{ item }">
            <v-chip color="primary">
                {{ totalCost(item) }} AZN
            </v-chip>
        </template>

        <template #status="{ item }">
            <v-chip :color="statusColor(item.status)">{{ item.status }}</v-chip>
        </template>

    </DataDynamicTable>
</template>

<script>
export default {
    name: "OrdersDataTable",
    props: {
        component: Object,
        data: Array
    },

    data: (app) => ({

        headers: [
            {
                text: app.$t('Purchaser'),
                value: 'purchaser',
                visible: true,
                fixed: false,
                sortable: false,
                class: 'text-no-wrap'
            },
            {text: app.$t('Email'), value: 'email', visible: true, fixed: false, sortable: false},
            {
                text: app.$t('Phone'),
                value: 'phone',
                visible: true,
                fixed: false,
                sortable: false,
                class: 'text-no-wrap'
            },
            {
                text: app.$t('Total amount'),
                value: 'totalAmount',
                visible: true,
                fixed: false,
                sortable: false,
                align: 'center'
            },
            {
                text: app.$t('Total cost'),
                value: 'totalCost',
                visible: true,
                fixed: false,
                sortable: false,
                class: 'text-no-wrap'
            },
            {
                text: app.$t('Payment status'),
                value: 'status',
                visible: true,
                fixed: false,
                sortable: false,
                class: 'text-no-wrap'
            },
            {text: app.$t('Created at'), value: 'createdAt', visible: true, fixed: false, sortable: false},
            {text: app.$t('Seen at'), value: 'updatedAt', visible: true, fixed: false, sortable: false},
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
                name: app.$t('Details'),
                icon: 'mdiEyeOutline',
                to: (item) => app.$localePath({
                    name: `apps-${app.$appModule().key}-products-${app.component.options.section}-detail`,
                    params: {detail: item._id}
                }),
                condition: app.$can('read', `${app.$appModule().key}-${app.component.options.section}`)
            },
            {
                name: app.$t('Delete'),
                icon: 'mdiDeleteOutline',
                onClick: async (item) => await app.$deleteData({
                    api: `${app.api}/${item._id}`,
                    callback: () => {
                        app.$reFetch()
                        return true
                    }
                }),
                condition: app.$can('delete', `${app.$appModule().key}-${app.component.options.section}`)
            }
        ],

        api: 'orders',
        query: {
            section: app.component.options.section
        }
    }),

    methods: {
        totalCost(order) {
            return order.products.reduce((acc, product) => acc + ((product?.detail?.discountedPrice || product?.detail?.price) * product.amount), 0)
        },

        totalAmount(order) {
            return order.products.reduce((acc, product) => acc + product.amount, 0)
        },

        statusColor(status){
            switch (status) {
                case 'APPROVED':
                    return 'primary'
                case 'CANCELED':
                    return 'orange'
                case 'DECLINED':
                    return 'red'
                default:
                    return
            }
        }
    }
}
</script>
