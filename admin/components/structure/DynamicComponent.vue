<template>
    <Component :is="component.uid" :component="component" :data="data" :index="index" :item-props="itemProps">
        <DynamicComponent v-for="(component, i) in component.components" :component="component"
                          :data="data" :key="`component-${i}`"/>
    </Component>
</template>

<script>
export default {
    name: 'DynamicComponent',
    props:{
        component: Object,
        data: [Object, Array],
        index: Number,
        itemProps: Object,
    }
};
</script>
