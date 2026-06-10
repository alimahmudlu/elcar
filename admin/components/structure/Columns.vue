<template>
    <v-row :class="component.options.class">
        <slot/>
    </v-row>
</template>

<script>
export default {
    name: 'Columns',
    props:{
        component: Object,
        data: [Array, Object]
    }
};
</script>
