<template>
    <div class="d-inline-flex flex-column align-center justify-start">
        <span class="hidden-txt d-inline-block mr-auto overflow-hidden" ref="hiddenTxt" v-text="value"/>
        <input :value="value" ref="resizedInput" class="resized-input px-1 text-center"
               :class="$dark() ? 'white--text': 'black--text'" v-bind="$attrs" @input="input"/>
    </div>
</template>

<script>
export default {

    name: 'ResizedInput',

    props:{
        value: [String, Number]
    },

    model:{
        prop: 'value',
        event: 'value',
    },

    mounted() {
        this.resize()
    },

    methods:{

        resize(){
            setTimeout(()=> {
                const hiddenTxt = this.$refs['hiddenTxt']
                const width = hiddenTxt.offsetWidth
                const resizedInput = this.$refs['resizedInput']
                resizedInput.style.width = width + 10 + 'px'
            })
        },

        input(e){

            this.$emit('value', e.target.value)
            this.resize()
        }
    }
};
</script>

<style lang="scss">

.resized-input {
    font: inherit;
    margin: 0;
    border: none;
    min-width: 15px !important;
    height: 20px;
    padding-top: 2px;

    &:focus-visible {
        outline: none;
    }
}

.hidden-txt {
    white-space: pre;
    height: 0;
    opacity: 0;
    min-width: 15px;
}
</style>
