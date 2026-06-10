<template>
    <div class="dynamic-table-wrapper">

        <v-card tile flat class="overflow-hidden d-flex">

            <v-data-table :headers="fixedHeaders" :items="table.data"
                          :options.sync="table.options"
                          :footer-props="table.footerProps"
                          :items-per-page="table.options.itemsPerPage"
                          :server-items-length="table.options.serverItemsLength"
                          :height="table.options.height"
                          mobile-breakpoint="0" fixed-header hide-default-footer
                          v-bind="$attrs" v-model="selectedItems"
                          @input="selectAll($event)" class="rounded-0"
                          v-if="fixedHeaders.length">

                <template #header.data-table-select="{ on , props }">
                    <v-simple-checkbox v-bind="props" v-on="on" color="secondary"
                                       :on-icon="mdiCheckboxMarked"
                                       :off-icon="mdiCheckboxBlankOutline"
                                       :indeterminate-icon="mdiMinusBox"/>
                </template>

                <template #body="{ items }">
                    <tbody>
                    <tr v-for="item in items" :class="{'v-data-table__selected': selectedItems.includes(item)}">

                        <td v-if="typeof $attrs['show-select'] !== 'undefined'">
                            <v-checkbox v-model="selectedItems" color="secondary"
                                        hide-details class="ma-0 pa-0 rounded-0" :value="item" multiple
                                        :on-icon="mdiCheckboxMarked" :off-icon="mdiCheckboxBlankOutline"/>
                        </td>

                        <td v-for="(header, i) in fixedHeaders" :key="`fixed-table-${i}`" class="rounded-0"
                            :class="[
                            header.align ? `text-${header.align}` : '',
                            {'border-right': i + 1 === fixedHeaders.length}, header.class]">

                            <slot :name="header.value" :item="item" v-if="hasSlot(header.value)"/>

                            <template v-else>{{ item[header.value] }}</template>

                        </td>

                    </tr>
                    </tbody>
                </template>

                <template #footer>
                    <v-divider/>
                </template>

            </v-data-table>

            <v-data-table :headers="staticHeaders" :items="table.data"
                          :options.sync="table.options"
                          :footer-props="table.footerProps"
                          :items-per-page="table.options.itemsPerPage"
                          :server-items-length="table.options.serverItemsLength"
                          :height="table.options.height"
                          mobile-breakpoint="0" fixed-header
                          :show-select="typeof $attrs['show-select'] !== 'undefined' && !fixedHeaders.length"
                          v-bind="$attrs" :loading-text="$t('Loading') + '...'"
                          v-model="selectedItems" @input="selectAll($event)"
                          class="flex-fill rounded-0" ref="main-table">

                <template #header.data-table-select="{ on , props }">
                    <v-simple-checkbox v-bind="props" v-on="on" color="secondary"
                                       :on-icon="mdiCheckboxMarked" :off-icon="mdiCheckboxBlankOutline"
                                       :indeterminate-icon="mdiMinusBox"/>
                </template>

                <template #body="{ items }">
                    <tbody>
                    <tr v-for="item in items" :class="{'v-data-table__selected': selectedItems.includes(item)}">

                        <td v-if="typeof $attrs['show-select'] !== 'undefined' && !fixedHeaders.length">
                            <v-checkbox v-model="selectedItems" color="secondary"
                                        hide-details class="ma-0 pa-0 rounded-0" :value="item" multiple
                                        :on-icon="mdiCheckboxMarked" :off-icon="mdiCheckboxBlankOutline"/>
                        </td>

                        <td v-for="(header, i) in staticHeaders" :key="`main-table-${i}`" class="rounded-0"
                            :class="[ header.align ? `text-${header.align}` : '', header.class ]">

                            <slot :name="header.value" :item="item" v-if="hasSlot(header.value)"/>

                            <template v-else>

                                <template v-if="header.value === 'action'">
                                    <DataActionsMenu :actions="actions" :item="item"/>
                                </template>

                                <template v-else-if="['createdAt', 'updatedAt', ...dates].includes(header.value)">
                                    <Date :date="headerValue(item, header)"/>
                                </template>

                                <template v-else-if="isBoolean(headerValue(item, header))">
                                    <Icon :name="headerValue(item, header) ? 'mdiCheckboxMarked' : 'mdiCheckboxBlankOutline'"
                                          :color="headerValue(item, header) ? 'primary' : ''"/>
                                </template>

                                <template v-else>
                                    {{ headerValue(item, header) }}
                                </template>

                            </template>

                        </td>

                    </tr>
                    </tbody>
                </template>

            </v-data-table>

        </v-card>

        <v-btn text tile height="80" width="10" min-width="auto" hidden ref="leftBtn"
               class="table-scroll-btn absolute px-0 text-center transition-fast-out-slow-in left-0"
               style="top: calc(50% - 40px)">
            <Icon name="mdiChevronLeft"/>
        </v-btn>

        <v-btn text tile height="80" width="10" min-width="auto" hidden ref="rightBtn"
               class="table-scroll-btn absolute px-0 text-center transition-fast-out-slow-in"
               :class="hasActions ? 'right-13' : 'right-0'" style="top: calc(50% - 40px)">
            <Icon name="mdiChevronRight"/>
        </v-btn>

    </div>
</template>

<script>

import tableGeneral from '@/mixins/table'
import tableDynamic from "@/mixins/dynamic-table";

import { mdiCheckboxBlankOutline, mdiCheckboxMarked, mdiMinusBox } from '@mdi/js'

export default {

    name: "DataDynamicTable",

    mixins: [ tableGeneral, tableDynamic ],

    model: {
        prop: 'selected',
        event: 'selected',
    },

    data: () => ({
        mdiCheckboxBlankOutline,
        mdiCheckboxMarked,
        mdiMinusBox,

        selectedItems: []
    }),

    mounted() {
        setTimeout(() => this.toggleScrollTable(), 2000)
    },

    computed: {

        visibleHeaders() {
            return this.headers.filter(header => header.visible)
        },

        fixedHeaders() {
            return this.visibleHeaders.filter(header => header.fixed)
        },

        staticHeaders() {
            return this.visibleHeaders.filter(header => !header.fixed)
        },

        hasActions() {
            return this.staticHeaders.find(col => col.value === 'action')
        },

        dates() {
            return this.dateValues || []
        }

    },

    watch: {

        selected(selected) {
            this.setSelectedItems(selected)
        },

        'table.data': {
            deep: true,
            handler() {
                this.selected && this.setSelectedItems(this.selected)
            }
        }
    },

    methods: {

        hasSlot(key) {
            return this.$scopedSlots[key]
        },

        headerValue(item, header){
            const key = `item.${header.value}`
            return eval(key)
        },

        isBoolean(val) {
            return typeof val === 'boolean'
        },

        emit(list) {
            this.$emit('selected', list)
        },

        selectAll(list) {

            const itemKey = this.$attrs['item-key']

            const items = []

            list.forEach(item => items.push(itemKey ? item[itemKey] : item));

            this.emit(items)

        },

        setSelectedItems(selectedList) {

            const selectedItems = []
            const itemKey = this.$attrs['item-key']

            if (selectedList.length) {

                selectedList.forEach(item => {
                    const selectedItem = this.table.data.find(tItem => (itemKey ? tItem[itemKey] : tItem) === item)
                    selectedItem && selectedItems.push(selectedItem);
                })

                this.selectedItems = this.selectedItems.concat(selectedItems)

            } else {
                this.selectedItems = []
            }
        },

        toggleScrollTable() {

            const mainTable = this.$refs['main-table']?.$el

            if (mainTable) {

                const tableWrapper = mainTable.querySelector('.v-data-table__wrapper')

                const table = tableWrapper.querySelector('table')

                const wrapperWidth = tableWrapper.clientWidth
                const tableWidth = table.clientWidth

                const leftBtn = this.$refs['leftBtn'].$el
                const rightBtn = this.$refs['rightBtn'].$el

                rightBtn.hidden = tableWidth <= wrapperWidth

                tableWrapper.appendChild(leftBtn)
                tableWrapper.appendChild(rightBtn)

                leftBtn.addEventListener('click', () => {
                    tableWrapper.scrollLeft -= 200
                })

                rightBtn.addEventListener('click', () => {
                    tableWrapper.scrollLeft += 200
                })

                tableWrapper.addEventListener('scroll', () => {
                    if (tableWidth > wrapperWidth) {
                        leftBtn.hidden = tableWrapper.scrollLeft <= 0;
                        rightBtn.hidden = tableWidth <= tableWrapper.scrollLeft + wrapperWidth;
                    } else {
                        leftBtn.hidden = true
                        rightBtn.hidden = true
                    }
                })
            }
        },

    },
}
</script>

<style lang="scss">

html:has(.v-data-table) {
    overflow: hidden !important;
}

.table-scroll-btn {
    &:hover {
        width: 50px !important;
    }
}

.v-data {

    &-table {

        --extra-gutter: 0px;

        &-header {
            th {
                span {
                    white-space: nowrap !important;
                }
            }
        }
    }

    &-footer {
        margin: 0 !important;
    }
}
</style>
