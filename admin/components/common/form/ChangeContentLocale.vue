<template>
    <div style="width: 80px" v-if="$i18n.locales.length > 1">
        <v-select v-model="locale" :items="$i18n.locales" item-text="code" item-value="code" full-width
                  dense hide-details outlined :append-icon="mdiChevronDown" :no-data-text="$t('No data')"/>
    </div>
</template>

<script>

import {mdiChevronDown} from '@mdi/js'

export default {
    name: "ChangeContentLocale",

    data: ()=> ({
        mdiChevronDown,
    }),

    computed:{
        locale:{
            get(){
                return this.$store.state.data.contentLocale
            },
            set(data){
                this.$setState({store: 'data', key: 'contentLocale', data})
            }
        }
    }
}
</script>
