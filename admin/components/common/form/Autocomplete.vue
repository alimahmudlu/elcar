<template>
    <v-autocomplete v-model="data" v-bind="$attrs" outlined dense clearable type="text"
                    :clear-icon="mdiClose" :append-icon="mdiChevronDown" aria-autocomplete="none"
                    :error-messages="errorMessages" @change="$emit('value', data)">

        <template #item="{ active, item, attrs, on, multiple }">
            <v-list-item v-on="on" v-bind="attrs" #default="{ active }">

                <v-list-item-action>
                    <v-checkbox :input-value="active" :on-icon="mdiCheckboxMarked" :off-icon="mdiCheckboxBlankOutline"/>
                </v-list-item-action>

                <v-list-item-content>
                    <v-list-item-title v-text="text(item)"/>
                </v-list-item-content>

            </v-list-item>
        </template>

    </v-autocomplete>
</template>

<script>

import {mdiCheckboxBlankOutline, mdiCheckboxMarked, mdiChevronDown, mdiClose, mdiMagnify} from '@mdi/js';

export default {

    name: "Autocomplete",

    props: {
        value: [String, Array, Object],
        errorMessages: Array,
        index: Number
    },

    model: {
        prop: 'value',
        event: 'value'
    },

    data: (app) => ({

        data: app.value,

        mdiClose,
        mdiMagnify,
        mdiCheckboxMarked,
        mdiCheckboxBlankOutline,
        mdiChevronDown

    }),

    mounted() {
        setTimeout(()=> this.data = this.value, 100)
    },

    methods: {
        text(item) {
            const text = this.$attrs['item-text']
            const key = `item.${text}`
            return eval(key)
        },
    }

}

</script>
