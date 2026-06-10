<template>
    <MediaFilePreviews :previews="previews" :size="size" :multiple="multiple" :edit="true" @delete="deleteFile($event)"
                       v-intersect="onIntersect"/>
</template>

<script>
export default {
    name: 'SelectedFiles',

    props: {
        files: [ Array, String ],
        size: [ Number, String ],
        multiple: Boolean
    },

    data: () => ({
        previews: [],
        intersect: false,
        deleted: false,
    }),

    watch: {
        files: {
            deep: true,
            handler() {
                this.intersect && !this.deleted && this.getPreviews()
                this.deleted = false
            },
        }
    },

    methods: {

        onIntersect(entries, observer, isIntersecting) {
            if (isIntersecting && !this.intersect) {
                !this.intersect && this.getPreviews();
                this.intersect = true
            }
        },

        async getPreviews() {
            if (this.files && this.files.length) {
                const { data } = await this.$axios.get('uploads', { params: { _id: this.files, noPagination: true } })
                this.previews = data
                this.$emit('previews', data)
            } else {
                this.previews = []
            }
        },

        deleteFile(id) {

            let files = null

            if (this.multiple) {
                this.previews = this.previews.filter(file => file._id !== id)
                files = this.files.filter(fileId => fileId !== id)
            } else {
                this.previews = null
            }
            this.deleted = true
            this.$emit('files', files)
        }
    }
};
</script>
