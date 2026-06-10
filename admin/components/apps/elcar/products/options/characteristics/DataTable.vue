<template>
    <DataDynamicTable :api="api" :state-key="component.options.section" :query="filterQuery" :headers="headers"
                      :actions="actions" :callback="setData">

        <template #group="{ item }">
            {{ item.group && item.group.name || '-- --' }}
        </template>

        <template #categories="{ item }">
            <div class="pb-1">
                <v-chip small color="primary" class="mr-1 mt-1" v-for="(category, i) in item.categories" :key="`category-${i}`">
                    {{ category.name }}
                </v-chip>
            </div>
        </template>

        <template #showOnItem="{ item }">
            <Icon :name="showOnItem(item) ? 'mdiCheckboxMarked' : 'mdiCheckboxBlankOutline'"
                  :color="showOnItem(item) ? 'primary' : ''"/>
        </template>

        <template #showOnFilter="{ item }">
            <Icon :name="showOnFilter(item) ? 'mdiCheckboxMarked' : 'mdiCheckboxBlankOutline'"
                  :color="showOnFilter(item) ? 'primary' : ''"/>
        </template>

        <template #addToSlug="{ item }">
            <Icon :name="addToSlug(item) ? 'mdiCheckboxMarked' : 'mdiCheckboxBlankOutline'"
                  :color="addToSlug(item) ? 'primary' : ''"/>
        </template>

        <template #component="{ item }">
            <v-chip small color="lighten">
                <{{ item.component.name }}/>
            </v-chip>
        </template>

        <template #section="{item}">
            <v-chip small dark color="deep-orange" v-text="item.section"/>
        </template>

    </DataDynamicTable>
</template>

<script>
export default {
    name: "CharacteristicDataTable",
    props: {
        component: Object,
        data: Array
    },

    data: (app) => ({

        api: 'characteristics',

        headers: [
            { text: app.$t('Name'), value: 'name', visible: true, fixed: false, sortable: false, class: 'text-no-wrap' },
            { text: app.$t('Key'), value: 'key', visible: true, fixed: false, sortable: false, class: 'text-no-wrap' },
            { text: app.$t('Section'), value: 'section', visible: true, fixed: false, sortable: false, class: 'text-no-wrap' },
            { text: app.$t('Categories'), value: 'categories', visible: true, fixed: false, sortable: false, width: 350 },
            { text: app.$t('Group'), value: 'group', visible: true, fixed: false, sortable: false, class: 'text-no-wrap' },
            { text: app.$t('Show on item'), value: 'showOnItem', visible: true, fixed: false, sortable: false, align: 'center' },
            { text: app.$t('Show on filter'), value: 'showOnFilter', visible: true, fixed: false, sortable: false, align: 'center' },
            { text: app.$t('Add to slug'), value: 'addToSlug', visible: true, fixed: false, sortable: false, align: 'center' },
            { text: app.$t('Component'), value: 'component', visible: true, fixed: false, sortable: false },
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

    computed: {
        filterQuery() {
            return {
                $populate: 'group',
                ...this.$route.query
            }
        }
    },

    methods: {
        setData() {
            this.content = this.$store.state.data[this.component.options.section]
        },

        addToSlug(item){
            return item?.component?.attrs?.addToSlug
        },

        showOnItem(item){
            return item?.component?.attrs?.showOnItem
        },

        showOnFilter(item){
            return item?.component?.attrs?.showOnFilter
        }
    }
}
</script>
