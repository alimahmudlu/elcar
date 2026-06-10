<template>
    <v-icon v-text="icon" v-bind="$attrs" v-if="icon"/>
</template>

<script>
export default {
    name: "Icon",
    props: {
        name: String,
    },
    data: ()=>({
        icon: null,
    }),
    async fetch() {
        await this.setIcon()
    },
    watch:{
        name(val){
            val && this.setIcon()
        }
    },
    methods:{
        async setIcon(){
            const {[this.name]: icon} = await import('@mdi/js')
            this.icon = icon
        }
    }
}
</script>
