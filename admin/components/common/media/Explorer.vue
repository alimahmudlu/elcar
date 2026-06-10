<template>
    <v-card tile class="d-flex flex-column fill-height overflow-hidden">

        <v-card tile elevation="1" class="d-flex justify-space-between align-center z-index-5 pr-4">

            <v-card-title class="pa-2 pl-md-4 py-md-3 font-weight-bold d-flex flex-nowrap">

                <v-btn icon class="mr-3" @click="getBack">
                    <Icon :name="activeFolder ? 'mdiArrowLeft' : 'mdiMultimedia'"/>
                </v-btn>

                <span class="line-clamp line-1" v-text="activeFolder ? activeFolder.name : $t('Media explorer')"/>

            </v-card-title>

            <div class="d-flex align-center ml-auto">

                <v-btn rounded depressed color="primary" class="mr-3 mr-md-4"
                       :disabled="$isSame(data.files, files) || (multiple && !files.length || !multiple && !files)"
                       @click="chooseSelected">

                    <Icon name="mdiCheck" :left="$vuetify.breakpoint.smAndUp"/>

                    {{ $vuetify.breakpoint.smAndUp ? $t('Use selected') : '' }}

                </v-btn>

                <v-tooltip bottom>

                    <template #activator="{ on, attrs }">
                        <v-btn icon @click="close" v-bind="attrs" v-on="on">
                            <Icon name="mdiClose"/>
                        </v-btn>
                    </template>

                    {{ $t('Close') }}

                </v-tooltip>

            </div>

        </v-card>

        <div class="flex-fill overflow-auto lighten transition-fast-in-fast-out"
             :style="detailsBar && $vuetify.breakpoint.mdAndUp ? {paddingRight: '390px'} : null">

            <v-container class="pa-3 pa-md-6">

                <div class="d-flex align-center justify-space-between mb-3 mb-md-6">

                    <SectionTitle :title="`${$tc('_ folders', totalFolderCount, {n: totalFolderCount})}`"
                                  size="text-body-1" :bottom-gutter="null"/>

                    <div class="d-flex align-center">
                        <v-btn small depressed color="primary"
                               @click="$openDialog({
                                    component: 'common/media/folder/Form',
                                    data: {
                                        activeFolder,
                                        appId: data.appId,
                                        callback: getFolders
                                    },
                                    options:{
                                        width: 400
                                    }
                               })">
                            <Icon name="mdiPlus" left/>
                            {{ $t('Create _', { n: $t('Folder') }) }}
                        </v-btn>
                    </div>

                </div>

                <DataGridList :component="folderGridList" :re-fetch="reFetchFolders" :activeFolder="activeFolder"
                              :getFolder="getFolder" :getFolders="getFolders" v-if="ready"/>

            </v-container>

            <v-divider/>

            <v-container class="pa-3 pa-md-6">

                <div class="d-flex align-center justify-space-between mb-3 mb-md-6">

                    <SectionTitle :title="`${$tc('_ files', totalFileCount, {n: totalFileCount})}`"
                                  size="text-body-1" :bottom-gutter="null"/>

                    <div class="d-flex align-center">

                        <v-btn small depressed :color="uploadPanel ? '' : 'primary'" class="mr-4"
                               @click="uploadPanel = !uploadPanel">
                            <Icon :name="uploadPanel ? 'mdiClose' : 'mdiCloudUpload'" left/>
                            {{ $t(uploadPanel ? 'Close' : 'Upload file') }}
                        </v-btn>

                        <v-btn-toggle v-model="view" dense mandatory>
                            <v-btn v-for="(gView, i) in views" :key="`view-${i}`" :value="gView.key" small class="pa-1"
                                   min-width="auto">
                                <Icon :name="gView.icon" size="18"/>
                            </v-btn>
                        </v-btn-toggle>

                    </div>

                </div>

                <MediaUpload class="mb-6" :hide-dialog="true" rounded="lg" elevation="16"
                             :multiple="true" :dimensions="data.dimensions" :saveCallback="getFiles"
                             :activeFolder="activeFolder" :app-id="data.appId" v-if="uploadPanel"/>

                <DataGridList :component="fileGridList" :re-fetch="reFetchFiles" :multiple="multiple" :view="view"
                              :files="files" :getFiles="getFiles" :url="data.getUrl" :showFile="showFile"
                              :selectFile="selectFile" :deleteFile="deleteFile" v-if="ready"/>

            </v-container>

            <MediaFileDetail v-model="detailsBar" :detail="fileDetail"/>

        </div>

    </v-card>
</template>

<script>
export default {
    name: 'MediaExplorer',

    props: {
        data: Object
    },

    data() {
        return {

            files: null,
            detailsBar: false,
            fileDetail: null,
            uploadPanel: false,
            reFetchFolders: false,
            reFetchFiles: false,
            ready: false,

            view: 'list',

            views: [
                {
                    icon: 'mdiMenu',
                    key: 'list'
                },
                {
                    icon: 'mdiViewGridOutline',
                    key: 'grid4'
                },
                {
                    icon: 'mdiDotsGrid',
                    key: 'grid6'
                },
            ],
        }
    },

    async created() {

        if (this.data && this.data.folder) {
            await this.getFolder(this.data.folder, true)
        }

        this.ready = true
        this.files = structuredClone(this.data?.files) || this.multiple ? [] : null
    },

    computed: {

        folderId() {
            return this.$route.query['assets-folder'] || null
        },

        folderGridList() {
            return {
                options: {
                    grids: {
                        cols: 12,
                        sm: 4,
                        md: 3,
                    },
                    api: 'file-folders',
                    filter: {
                        folder: this.folderId || null,
                        modules: this.activeFolder?.modules || { $in: [ this.$appModule('general')._id, this.$appModule()._id ] }
                    },
                    dense: this.$vuetify.breakpoint.xsOnly,
                    limit: 8,
                    pagination: true,
                    onClick: true,
                    stateKey: 'fileFolders',
                    class: 'mb-2 mb-md-6'
                },
                components: [
                    {
                        uid: 'MediaFolderItem',
                        options: {},
                        components: []
                    }
                ]
            }
        },

        fileGridList() {
            return {
                options: {
                    grids: {
                        cols: this.view === 'list' ? 12 : this.view === 'grid6' ? 4 : 6,
                        sm: this.view === 'list' ? 12 : this.view === 'grid6' ? 2 : 4,
                        md: this.view === 'list' ? 12 : this.view === 'grid6' ? 2 : 3,
                    },
                    api: 'uploads',
                    filter: {
                        folder: this.folderId,
                        modules: this.activeFolder?.modules || { $in: [ this.$appModule('general')._id, this.$appModule()._id ] }
                    },
                    limit: 24,
                    pagination: true,
                    infiniteScroll: true,
                    stateKey: 'uploads',
                    class: this.view === 'list' ? 'mb-3' : 'mb-3 mb-md-6'
                },
                components: [
                    {
                        uid: 'MediaFileItem',
                        options: {},
                        components: []
                    }
                ]
            }
        },

        fileFolders() {
            return this.$store.state.data.fileFolders;
        },

        totalFolderCount() {
            return this.fileFolders?.meta.total;
        },

        uploads() {
            return this.$store.state.data.uploads;
        },

        totalFileCount() {
            return this.uploads?.meta.total;
        },

        multiple() {
            return this.data.multiple
        },

        activeFolder: {
            get() {
                const folder = this.$store.state.data.activeFolder
                return folder ? structuredClone(folder) : null
            },
            set(data) {
                this.$setState({ store: 'data', key: 'activeFolder', data })
            }
        },
    },

    watch: {
        activeFolder(val) {
            this.uploadPanel = false
        },

        folderId(id) {
            this.getFolder(id, true)
        }
    },

    methods: {

        getFolders() {
            this.reFetchFolders = true;
            setTimeout(() => this.reFetchFolders = false, 10);
        },

        async getFolder(id, start = false) {

            if (!start) {
                if (id) {
                    this.$pushQuery('assets-folder', id)
                } else {
                    this.$deleteQuery('assets-folder')
                    // this.$router.go(-1)
                }
            }

            id ? await this.$fetchData({
                store: 'data',
                api: `file-folders/${ id }`,
                key: 'activeFolder',
                force: true,
            }) : this.activeFolder = null
        },

        getFiles() {
            this.uploadPanel = false
            this.reFetchFiles = true;
            setTimeout(() => this.reFetchFiles = false, 10);
        },

        selectFile(selected) {
            this.files = selected
        },

        deleteFile(id) {

            const isSame = this.multiple ? this.files.includes(id) : this.files === id;
            isSame && this.data.selectCallback(null, false)

            this.getFiles()
        },

        showFile(file) {
            this.detailsBar = true;
            this.fileDetail = file;
        },

        chooseSelected() {
            this.data.selectCallback(this.files)
            this.$emit('close')
        },

        getBack() {
            if (this.activeFolder) {
                this.getFolder(this.activeFolder.folder)
                // this.$router.go(-1)
            }
        },

        close() {
            this.$deleteQuery('assets-folder')
            this.activeFolder = null
            this.$emit('close')
        }
    }
};
</script>
