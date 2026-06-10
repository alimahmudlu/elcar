<template>
    <v-dialog v-model="status" :width="width" :fullscreen="fullSize" :hide-overlay="sideBar"
              :persistent="options.persistent" :content-class="sideBar ? 'ma-0 h-full-vh ml-auto right-0' : ''"
              :transition="fullSize ? 'dialog-bottom-transition' : sideBar ? `dialog-${options.alignment || 'right'}-transition` : 'dialog-transition'">

        <component :is="component" :data="dialog.data" :type="options.type" :index="index"
                   :full-size="fullSize" :side-bar="sideBar" :key="options.type || `dialog-${index}`"
                   @close="close" @side-bar="setSideBar" @full-size="setFullSize" @resize="resize($event)"/>

    </v-dialog>
</template>

<script>

export default {
    name: "DialogWrapper",

    props: {
        dialog: Object,
        index: Number,
        length: Number,
    },

    data: ()=> ({
        status: false,
        sideBar: false,
        fullSize: false,
        addonWidth: 0,
    }),

    created() {

        this.sideBar = this.options.sideBar
        this.fullSize = this.options.fullSize || (typeof this.options.fullSize === 'undefined' && this.$vuetify.breakpoint.xsOnly)
        this.status = true

        const unregisterRouterGuard = this.$router.beforeEach((to, from, next) => {
            if(this.status === true){
                if(to.name !== from.name){
                    this.closeByIndex(this.length - 1)
                    next(false)
                }else{
                    next()
                }
            }else{
                next()
            }
        })

        this.$once('hook:destroyed', () => {
            if(this.status === true){
                unregisterRouterGuard()
            }
        })
    },

    watch:{
        status(val){
            !val && this.closeByIndex()
        }
    },

    computed:{

        options(){
            return this.dialog.options
        },

        component(){
            if(this.status){
                return ()=> import(`/components/${this.dialog.component}`)
            }
        },

        width(){
            return (this.options.width || 960) + this.addonWidth
        }
    },

    methods:{
        close(){
            this.status = false
        },

        closeByIndex(index = this.index){
            this.$store.commit('CLOSE_DIALOG', index)
        },

        setFullSize(){
            this.fullSize = !this.fullSize
            this.$storage.setLocalStorage('dialog-full-size', this.fullSize)
        },

        setSideBar(){
            this.sideBar = !this.sideBar
            this.$storage.setLocalStorage('dialog-side-bar', this.sideBar)
        },

        resize(size){
            this.addonWidth = size
        }
    }
}
</script>
