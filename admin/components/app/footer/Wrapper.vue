<template>
    <v-card tile flat :height="60" class="d-flex align-center">
        <v-container class="text-center">
            <strong class="grey--text text-body-2">
                {{ $t('Created by') }}
                <a :href="creator.link" :title="creator.name" target="_blank" rel="noopener noreferrer"
                   class="font-weight-black primary--text">
                    <u v-text="creator.name"/>
                </a>
            </strong>
        </v-container>
    </v-card>
</template>

<script>
export default {
    name: 'FooterWrapper',
    computed:{
        creator(){
            return this.$store.state.app.creator
        }
    }
};
</script>
