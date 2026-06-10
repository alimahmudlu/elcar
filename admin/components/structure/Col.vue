<template>
    <v-col :tag="component.options.tag" v-bind="{...component.options.size, ...order}" :class="component.options.class">
        <slot/>
    </v-col>
</template>

<script>
export default {
    name: 'Col',
    props:{
        component: Object,
        data: [Array, Object]
    },
    computed:{
        order(){
            return this.component.options.order ? Object.entries(this.component.options.order).reduce((obj, ord) => {
                return {...obj, [`order-${ord[0]}`]: ord[1]};
            }, {}) : {};
        }
    }
};
</script>
