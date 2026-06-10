<template>
    <div class="fill-height d-flex flex-column" style="max-height: calc(100vh - 64px)">

        <div class="px-6 pt-6 pb-3 fill-height d-flex flex-column overflow-auto">

            <v-card flat class="d-flex justify-center align-center flex-column lighten pa-6 mb-3" ref="dragAndDropArea"
                    @click="getImages">

                <input type="file" accept="image/*" ref="fileUpload" :multiple="multiple" class="d-none"
                       @change="addImages($event)">

                <Icon name="mdiCloudUpload" size="80" color="primary lighten-2"/>

                <span class="font-weight-bold d-block pt-3 text-center" v-html="$t('Drop your files(s) here or browse')"/>

                <div class="pt-2 text-caption font-weight-bold text-center">
                    <span class="mr-2" v-html="$t('Max. file size: _ mb', {n: 10})"/>
                    <span v-html="$t('Allowed formats') + ':'"/>
                    <span class='grey--text'>png, jpg, jpeg</span>
                </div>

            </v-card>

            <v-row class="mb-3" dense>
                <v-col cols="6" sm="4" md="2" class="mb-3" v-for="(image, i) in previews" :key="`image-${i}`">
                    <v-hover v-slot="{hover}">
                        <div class="relative">

                            <div class="absolute z-index-1 right-0 top-0 pa-1" v-if="hover && !loading">
                                <v-btn fab x-small depressed @click="deleteImage(i)" width="24" height="24">
                                    <Icon name="mdiClose"/>
                                </v-btn>
                            </div>

                            <v-img :src="image" class="fill-width bg-main-2 rounded-lg lighten" contain :aspect-ratio="1"
                                   content-class="d-flex align-center justify-center">

                                <v-row class="fill-height ma-0" align="center" justify="center" v-if="loading">
                                    <v-progress-circular indeterminate color="primary"/>
                                </v-row>

                            </v-img>

                        </div>
                    </v-hover>
                </v-col>
            </v-row>

        </div>

        <v-card flat tile class="px-6 py-3 sticky bottom-0 d-flex justify-end border-top">
            <v-btn depressed color="primary" @click="sendSelected" :disabled="!selected.length">
                {{$t('Upload')}}
            </v-btn>
        </v-card>

    </div>
</template>

<script>
export default {
    name: 'DragAndDrop',

    props:{
        multiple: Boolean
    },

    data: (app)=> ({
        selected: [],
        previews: [],
        loading: false,
    }),

    mounted() {
        this.dragAndDropUploadFile()
    },

    methods:{

        sendSelected(){
            this.selected.length && this.$emit('upload', this.selected)
            this.selected = []
            this.previews = []
        },

        getImages() {
            this.$refs['fileUpload'].click();
        },

        addImages(e) {

            const files = e.target.files;

            if(!this.multiple){
                this.selected = []
                this.previews = []
            }

            for (let i = 0; i < files.length; i++) {
                const file = files[i]
                const preview = URL.createObjectURL(file)
                this.selected.unshift(file)
                this.previews.unshift(preview)
            }

            this.$emit('re-open')
        },

        deleteImage(i) {
            this.selected.splice(i, 1);
            this.previews.splice(i, 1);
        },

        dragAndDropUploadFile() {

            const vm = this, dropArea = this.$refs['dragAndDropArea'].$el;

            ['dragenter', 'dragover', 'dragleave', 'drop'].forEach(eventName => {
                dropArea.addEventListener(eventName, preventDefaults, false);
            });

            function preventDefaults(e) {
                e.preventDefault();
                e.stopPropagation();
            }

            ['dragenter', 'dragover'].forEach(eventName => {
                dropArea.addEventListener(eventName, highlight, false);
            });

            ['dragleave', 'drop'].forEach(eventName => {
                dropArea.addEventListener(eventName, unHighlight, false);
            });

            function highlight(e) {
                dropArea.classList.add('highlight');
            }

            function unHighlight(e) {
                dropArea.classList.remove('highlight');
            }

            dropArea.addEventListener('drop', handleDrop, false);

            function handleDrop(e) {
                let dt = e.dataTransfer;
                let files = dt.files;

                handleFiles(files);
            }

            function handleFiles(files) {
                ([...files]).forEach(file => {

                    if(!vm.multiple){
                        vm.selected = []
                        vm.previews = []
                    }

                    vm.selected.unshift(file);
                    vm.previews.unshift(URL.createObjectURL(file));
                });
            }
        },
    }
};
</script>
