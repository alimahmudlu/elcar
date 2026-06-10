<template>
    <div class="flex-fill d-flex flex-column">

        <template v-if="upload">

            <v-overlay :value="uploadMenu" z-index="9"/>

            <v-menu v-model="uploadMenu" :close-on-content-click="false" nudge-width="2" bottom nudge-left="1"
                    content-class="z-index-9">

                <template #activator="{ on, attrs }">

                    <v-btn outlined color="grey" class="border flex-fill" v-bind="attrs" v-on="on">
                        <Icon name="mdiFolder" left/>
                        {{ title || $t('Add _', { n: $t('File') }) }}
                    </v-btn>

                </template>

                <MediaUpload :files="fileIds" :save-callback="saveCallback" :select-callback="selectCallback"
                             :query="query" :visible="uploadMenu" :multiple="multiple" :dimensions="dimensions"
                             :app-id="appId" outlined rounded @re-open="reOpen"/>

            </v-menu>

        </template>

        <template v-else>
            <v-btn outlined block text v-bind="$attrs" @click="openWindow">
                <Icon name="mdiFolderTableOutline" left size="20"/>
                {{ title || $t('Choose _', { n: $t('File') }) }}
            </v-btn>
        </template>

        <MediaSelectedFiles :files="fileIds" :size="size" :multiple="multiple" @files="$emit('files', $event)"
                            @previews="previews = $event"/>

        <div class="pl-3 mt-1 mb-2 overflow-hidden" style="height: 14px">
            <v-slide-y-transition>
                <small v-for="(error, i) in errorMessages" :key="i" class="caption error--text d-block lh-1"
                       v-text="error"/>
            </v-slide-y-transition>
        </div>

    </div>
</template>

<script>
export default {
    name: 'UploadMenu',

    props: {
        files: [ Array, String, Object ],
        appId: String,
        errorMessages: Array,
        title: String,
        multiple: Boolean,
        size: [ Number, String ],
        dimensions: Array,
        upload: {
            type: Boolean,
            default: true
        }
    },

    model: {
        prop: 'files',
        event: 'files'
    },

    data: () => ({
        uploadMenu: false,
        uploadTypeTab: 0,
        fileFetchingUrl: null,
        query: {},
        previews: null
    }),

    mounted() {
        this.$emit('files', this.fileIds)
    },

    computed: {

        folder() {
            if (this.previews) {
                return Array.isArray(this.previews) ? this.previews[0]?.folder : this.previews?.folder;
            }
        },

        fileIds: {
            get() {
                return this.files
                    ? this.multiple
                        ? Array.isArray(this.files)
                            ? this.files?.map(file => typeof file === 'object' ? file._id : file)
                            : typeof this.files === 'object'
                                ? [ this.files._id ]
                                : [ this.files ]
                        : Array.isArray(this.files)
                            ? typeof this.files[0] === 'object'
                                ? this.files[0]._id
                                : this.files[0]
                            : typeof this.files === 'object'
                                ? this.files._id
                                : this.files
                    : null;
            },
            set(val) {
                this.$emit('files', val)
            }
        }
    },

    watch: {
        uploadMenu(val) {
            if (val && this.uploadTypeTab === 2) this.uploadTypeTab = 0
        }
    },

    methods: {

        deleteCallback(files) {
            this.$emit('files', files)
        },

        selectCallback(files, close = true) {

            if (!this.$isSame(this.fileIds, files)) {
                this.$emit('files', files)
            }

            close && this.close();
        },

        saveCallback(data) {
            const fileIds = data.map(file => file._id)
            this.$emit('files', this.multiple ? [ ...this.fileIds, ...fileIds ] : fileIds[0])
            this.close();
        },

        reOpen() {
            this.uploadMenu = false;
            setTimeout(() => this.uploadMenu = true);
        },

        close() {
            setTimeout(() => this.uploadMenu = false);
        },

        openWindow() {

            if(this.folder){
                this.$pushQuery('assets-folder', this.folder)
            }

            this.$openDialog({
                component: 'common/media/Explorer',
                data: {
                    files: this.files,
                    query: this.query,
                    multiple: this.multiple,
                    appId: this.appId,
                    dimensions: this.dimensions,
                    folder: this.folder,
                    selectCallback: this.selectCallback,
                    deleteCallback: this.deleteCallback,
                },
                options: {
                    fullSize: true
                }
            })
        }
    }

};
</script>
