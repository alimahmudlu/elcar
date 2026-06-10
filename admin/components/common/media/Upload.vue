<template>
    <v-card v-bind="$attrs" class="overflow-hidden d-flex flex-column" max-width="100%" max-height="calc(100vh - 24px)">

        <v-tabs v-model="uploadTypeTab" background-color="transparent" color="primary" grow height="38">

            <v-tab class="text-reset border-right">
                <Icon name="mdiLaptop" left size="20"/>
                {{ $t('From my computer') }}
            </v-tab>

            <v-tab class="text-reset">
                <Icon name="mdiFileLinkOutline" left size="20"/>
                {{ $t('From URL') }}
            </v-tab>

            <v-tab class="text-reset border-left" v-if="!hideDialog"
                   @click="$openDialog({
                        component: 'common/media/Explorer',
                        data: {
                            files,
                            callback: selectCallback,
                            multiple,
                            dimensions
                        },
                        options:{
                            fullSize: true
                        }
                   })">
                <Icon name="mdiFolderTableOutline" left size="20"/>
                {{ $t('From uploaded files') }}
            </v-tab>

        </v-tabs>

        <v-divider/>

        <v-tabs-items v-model="uploadTypeTab">

            <v-tab-item>
                <MediaDragAndDrop :multiple="multiple" @upload="uploadFiles($event)" @re-open="$emit('re-open')"/>
            </v-tab-item>

            <v-tab-item>
                <MediaFetchFromUrl :multiple="multiple" @upload="uploadFiles($event)" @re-open="$emit('re-open')"/>
            </v-tab-item>

        </v-tabs-items>

    </v-card>
</template>

<script>

import { pngCutter } from 'png-cutter';

export default {
    name: 'MediaUpload',

    props: {
        files: Array,
        query: {
            type: Object,
            default: {}
        },
        appId: String,
        activeFolder: Object,
        dimensions: {
            type: Array,
            default: [ 1200, 1200 ]
        },
        hideDialog: Boolean,
        visible: Boolean,
        multiple: Boolean,
        saveCallback: Function,
        selectCallback: Function,
    },

    data: () => ({
        uploadTypeTab: 0,
        fileFetchingUrl: null,
    }),

    watch: {
        visible(val) {
            if (val && this.uploadTypeTab === 2) this.uploadTypeTab = 0
        }
    },

    methods: {

        toBase64(file) {
            return new Promise((resolve, reject) => {
                const reader = new FileReader();
                reader.readAsDataURL(file);
                reader.onload = () => resolve(reader.result);
                reader.onerror = error => reject(error);
            })
        },

        base64toBlob(base64) {
            return fetch(base64).then(res => res.blob())
        },

        dataURLtoFile(dataUrl, filename) {

            let arr = dataUrl.split(','),
                mime = arr[0].match(/:(.*?);/)[1],
                bstr = atob(arr[1]),
                n = bstr.length,
                u8arr = new Uint8Array(n);

            while (n--) {
                u8arr[n] = bstr.charCodeAt(n);
            }

            return new File([ u8arr ], filename, { type: mime });
        },

        async uploadFiles(files) {

            let payload = []

            await Promise.all(files.map(async file => {
                if (file.type === 'image/png') {
                    const base64 = await this.toBase64(file)
                    const result = await pngCutter(base64)
                    return this.dataURLtoFile(result.dataUrl, file.name)
                } else {
                    return file
                }
            })).then(result => payload = result)

            const modules = this.activeFolder?.modules || [ this.appId || this.$appModule()._id ]

            await this.$saveData({
                api: 'uploads',
                query: {
                    dimensions: this.dimensions,
                    folder: this.activeFolder?._id,
                    modules,
                    ...this.query
                },
                payload,
                isFormData: true,
                alert: false,
                callback: this.saveCallback,
            })
        }
    }

};
</script>
