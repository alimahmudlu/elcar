<template>
    <v-card max-width="100vw" :width="600" elevation="16" rounded="xl"
            class="ma-auto text-center d-flex align-center justify-center flex-column pa-6 pa-md-16">

        <h2 class="font-weight-black text-md-h4 primary--text mb-4">Invitation</h2>

        <p class="text-body-2 lh-1-6 grey--text mb-6 mb-md-10">
            Lorem ipsum dolor sit amet, consectetur adipisicing elit. Asperiores numquam optio vitae?
        </p>

        <v-btn large color="primary">{{ $t('Accept') }}</v-btn>

    </v-card>
</template>

<script>

export default {
    name: 'index',

    async created() {
        await this.$deleteQuery('invitation')
    }
}
</script>
