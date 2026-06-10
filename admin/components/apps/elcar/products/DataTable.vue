<template>
    <DataDynamicTable :api="api" :query="query" :state-key="component.options.section" :headers="headers" :actions="actions">

        <template #brand="{ item }">
            <span class="text-no-wrap" v-text="item.brand.name"/>
        </template>

        <template #model="{ item }">
            <span class="text-no-wrap" v-text="item.model.name"/>
        </template>

        <template #category="{ item }">
            <span class="text-no-wrap" v-text="item.category.name"/>
        </template>

        <template #price="{ item }">
            <span class="d-inline-flex align-center rounded-pill lighten">

                <template v-if="item.discount">
                    <small class="px-3 text-no-wrap"><s v-text="item.price + ' AZN'"/></small>
                </template>

                <v-chip color="primary" class="font-weight-bold">
                    {{ item.discountedPrice }} AZN
                </v-chip>

            </span>
        </template>

        <template #discount="{ item }">
            {{ +item.discount }} %
        </template>

    </DataDynamicTable>
</template>

<script>
export default {
    name: "ProductDataDynamicTable",
    props: {
        component: Object,
        data: Array
    },

    data: (app) => ({

        api: 'products',

        query: {
            section: app.component.options.section
        },

        headers: [
            { text: app.$t('Brand'), value: 'brand', visible: true, fixed: false, sortable: false },
            { text: app.$t('Model'), value: 'model', visible: true, fixed: false, sortable: false },
            { text: app.$t('Category'), value: 'category', visible: true, fixed: false, sortable: false },
            { text: app.$t('Price'), value: 'price', visible: true, fixed: false, sortable: false },
            { text: app.$t('Discount'), value: 'discount', visible: true, fixed: false, sortable: false },
            { text: app.$t('Slider'), value: 'top', visible: true, fixed: false, sortable: false, align: 'center' },
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
                to: (item) => app.$localePath({
                    name: `apps-${app.$appModule().key}-products-${ app.component.options.section }-detail`,
                    params: { detail: item._id }
                }),
                condition: app.$can('update', `${app.$appModule().key}-${app.component.options.section}`)
            },
            {
                name: app.$t('Copy'),
                icon: 'mdiContentDuplicate',
                to: (item) => app.$localePath({
                    name: `apps-${app.$appModule().key}-products-${ app.component.options.section }-add`,
                    query: { copy: item._id }
                }),
                condition: app.$can('create', `${app.$appModule().key}-${app.component.options.section}`)
            },
            {
                name: app.$t('Delete'),
                icon: 'mdiDeleteOutline',
                onClick: async (item) => await app.$deleteData({
                    api: `${app.api}/${ item._id }`,
                    callback: () => {
                        app.$reFetch()
                        return true
                    }
                }),
                condition: app.$can('delete', `${app.$appModule().key}-${app.component.options.section}`)
            }
        ],
    }),
}
</script>
