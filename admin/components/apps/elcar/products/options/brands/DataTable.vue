<template>
    <DataDynamicTable :api="api" :state-key="component.options.section" :query="$route.query" :headers="headers"
                      :actions="actions" :callback="setData">

        <template #logo="{item}">
            <v-img :src="item.logo ? $src(item.logo.src) : null" :aspect-ratio="4/3" contain class="lighten"/>
        </template>

        <template #sections="{item}">
            <div class="d-flex flex-nowrap">
              <v-chip small dark color="deep-orange" class="mr-2" v-for="(section, i) in item.sections"
                      :key="`section-${i}`">
                {{ section }}
              </v-chip>
            </div>
        </template>

    </DataDynamicTable>
</template>

<script>
export default {
    name: "BrandsDataDynamicTable",
    props: {
        component: Object,
        data: Array
    },

    data: (app) => ({

        api: 'brands',

        headers: [
            { text: app.$t('Logo'), value: 'logo', visible: true, fixed: false, sortable: false, width: 80 },
            { text: app.$t('Name'), value: 'name', visible: true, fixed: false, sortable: false },
            { text: app.$t('Sections'), value: 'sections', visible: true, fixed: false, sortable: false },
            { text: app.$t('Best seller'), value: 'top', visible: true, fixed: false, sortable: false, align: 'center' },
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
                onClick: (item) => app.$openDialog({
                    component: `apps/${app.$appModule().key}/products/options/${ app.component.options.section }/Form`,
                    data: {
                        id: item._id
                    },
                    options: {
                        width: 400
                    }
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

    methods: {
        setData() {
            this.content = this.$store.state.data[this.component.options.section]
        }
    }
}
</script>
