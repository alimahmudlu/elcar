<template>
    <v-card tile class="d-flex flex-column fill-height">

        <div class="elevation-1 d-flex justify-space-between align-center z-index-2 pr-4">

            <v-card-title class="pa-2 pl-md-4 py-md-3 font-weight-bold">

                <Icon name="mdiFilter" left/>

                {{ $t('Filter') }}

            </v-card-title>

            <v-btn icon @click="$emit('close')">
                <Icon name="mdiClose"/>
            </v-btn>

        </div>

        <div class="flex-fill px-3 px-md-6 pt-6 overflow-auto">

            <v-select v-model="query.section" :label="$t('Section')" outlined dense clearable
                      :clear-icon="mdiClose" :append-icon="mdiChevronDown" :no-data-text="$t('No data')"
                      :items="sections" item-text="name" item-value="key" @change="query.group = null"/>

            <v-select v-model="query.group" :label="$t('Group')" outlined dense clearable
                      :clear-icon="mdiClose" :append-icon="mdiChevronDown" :no-data-text="$t('No data')"
                      :items="groups" item-text="name" item-value="_id"/>

        </div>

        <div class="d-flex justify-end pa-3 px-md-7 elevation-6 z-index-1">

            <v-btn rounded depressed @click="clear" class="mr-3">
                {{ $t('Clear') }}
            </v-btn>

            <v-btn rounded depressed color="primary" @click="filter">
                {{ $t('Filter') }}
            </v-btn>

        </div>

    </v-card>
</template>

<script>

import {mdiChevronDown, mdiClose} from '@mdi/js'

export default {
    name: "CharacteristicsFilterForm",
    props:{
        component: Object
    },

    data: ()=> ({

        mdiChevronDown,
        mdiClose,

        query: {
            section: null,
            group: null,
        },

    }),

    created(){
        this.getData()
        this.setQuery()
    },

    computed:{

        sections(){
            return this.$store.state.data.productSections
        },

        groups(){
            return this.$store.state.data['characteristic-groups']?.filter(group => group.section === this.query.section)
        }

    },

    methods: {

        setQuery(){
            const {group, section} = this.$route.query
            if(group) this.query.group = group
            if(section) this.query.section = section
        },

        async getData(){
            await this.$fetchData({
                store: 'data',
                api: 'characteristic-groups',
            })
        },

        async clear(){
            Object.keys(this.query).forEach(key => delete this.query[key])
            await this.filter();
        },

        async filter(){
            Object.entries(this.query).forEach(([key, value]) => !value && delete this.query[key])
            await this.$replacePath({ query: this.query });
            this.$emit('close')
        }

    }
}
</script>
