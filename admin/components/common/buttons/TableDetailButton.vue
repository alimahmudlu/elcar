<template>
    <v-tooltip top>
        <template #[`activator`]="{ on }">
            <v-btn icon :color="color" @click="$emit('click')" v-on="on">
                <v-icon small v-text="`mdi-${icon}`"/>
            </v-btn>
        </template>
        {{ title || $t('edit') }}
    </v-tooltip>
</template>

<script>
export default {
    name: "TableDetailButton",
    props:{
        title:{
            type: String,
        },
        icon:{
            type: String,
            default: 'pencil'
        },
        color:{
            type: String,
            default: 'blue'
        }
    }
}
</script>
