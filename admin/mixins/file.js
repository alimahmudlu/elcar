export const fileMixins = {
    methods: {

        /*============================================================================================================*/
        /* Delete Folder */
        /*============================================================================================================*/

        async deleteFolder(id) {
            await this.$deleteData({
                api: `file-folders/${id}`,
                alert: false,
                callback: ()=> this.itemProps.getFolders()
            })
        },

        /*============================================================================================================*/
        /* Delete File */
        /*============================================================================================================*/

        async deleteFile(id) {
            await this.$deleteData({
                api: `uploads/${id}`,
                alert: false,
                callback: this.itemProps.deleteFile
            })
        },
    }

};
