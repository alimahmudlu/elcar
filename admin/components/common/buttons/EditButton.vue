<template>
    <v-btn depressed rounded dark color="blue"
           :min-width="40" :height="40"
           class="px-2 px-sm-4" @click="$setEditForm(true)">

        <v-icon v-text="'mdi-pencil'" :left="$vuetify.breakpoint.smAndUp"/>

        {{ $vuetify.breakpoint.smAndUp ? $t('edit') : '' }}

    </v-btn>
</template>

<script>
export default {
    name: "EditButton",
}
</script>
