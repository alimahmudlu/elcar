<template>
    <v-breadcrumbs :items="breadcrumbs" class="px-0 py-3 py-sm-5 d-flex flex-nowrap overflow-auto text-no-wrap mw-100">
        <template #[`divider`]>
            <Icon name="mdiChevronRight" small/>
        </template>
    </v-breadcrumbs>
</template>

<script>
export default {
    name: 'Breadcrumbs',

    props:{
        component: Object,
        data: [Array, Object]
    },

    computed:{
        breadcrumbs() {
            return [
                {
                    text: this.$store.state.app.name[this.$i18n.locale],
                    to: this.$localePath('index'),
                    exact: true,
                },
                ...this.$store.state.data.breadcrumbs
            ]
        },
    }
};
</script>
