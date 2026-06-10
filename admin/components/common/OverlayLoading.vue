<template>
    <v-sheet height="100vh" width="100vw" color="primary" dark class="fixed z-index-16 d-flex justify-center align-center">
        <div class="text-center">

            <v-img :src="require('static/design/figure.png')" :aspect-ratio="16/9" :width="600" max-width="100%" contain/>

            <h1 class="mt-5 lh-1-2 text-h5 text-md-h4 font-weight-black"
                v-html="$t('Welcome to _', {n: $byLocale(app.name)})"/>

            <p class="mb-0 mt-2 text-caption">
                {{ $t('Created by') }}
                <a :href="app.creator.link" target="_blank" rel="noopener noreferrer" class="font-weight-black">
                    <u v-text="app.creator.name"/>
                </a>
            </p>

        </div>
    </v-sheet>
</template>

<script>
export default {
    name: 'OverlayLoading',

    computed: {
        app() {
            return this.$store.state.app;
        }
    }
};
</script>
