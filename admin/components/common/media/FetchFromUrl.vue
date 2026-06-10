<template>
    <div class="d-flex flex-column fill-height" style="max-height: calc(100vh - 64px)">

        <div class="px-6 pt-6 fill-height d-flex flex-column overflow-auto">

            <v-text-field v-model="fileFetchingUrl" dense outlined type="url"
                          :label="$t('Insert file url here')"
                          placeholder="https://"/>

            <img :src="previewFile" alt="preview-image" class="fill-width mb-6" v-if="previewFile">

        </div>

        <v-divider/>

        <v-card flat tile class="px-6 py-3 sticky bottom-0 d-flex justify-end">

            <template v-if="fetched">

                <v-btn depressed class="mr-3" @click="cancel">
                    {{ $t('Cancel') }}
                </v-btn>

                <v-btn depressed color="primary" @click="sendFile">
                    {{ $t('Upload') }}
                </v-btn>

            </template>

            <v-btn depressed color="primary" :loading="loading" @click="fetchFile" :disabled="!fileFetchingUrl" v-else>
                {{ $t('Fetch') }}
            </v-btn>

        </v-card>

    </div>
</template>

<script>
export default {
    name: 'FetchFromUrl',

    props:{
        multiple: Boolean
    },

    data: () => ({
        fileFetchingUrl: null,
        fetchedFile: null,
        previewFile: null,
        fetched: false,
        loading: false,
    }),

    methods: {
        async fetchFile() {
            try {


                let extension
                this.loading = true;
                this.fetchedFile = await fetch(this.fileFetchingUrl).then(res => {
                    extension = (res.url.split('.')[res.url.split('.').length - 1]).toLowerCase();
                    return res.blob()
                });
                this.fetchedFile.originalname = `blob.${extension}`
                this.fileFetchingUrl = null;
                this.fetched = true;
                this.previewFile = URL.createObjectURL(this.fetchedFile);
                setTimeout(() => this.$emit('re-open'), 50);

            } catch (error) {
                console.log(error);
            }

            this.loading = false;
        },

        sendFile() {
            this.cancel();
            this.$emit('upload', [this.fetchedFile]);
        },

        cancel(){
            this.fetched = false;
            this.previewFile = null;
            this.$emit('re-open');
        }
    }
};
</script>
