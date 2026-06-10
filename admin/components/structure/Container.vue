<template>
    <v-container :fluid="component.options.fluid" :class="component.options.class">
        <slot/>
    </v-container>
</template>

<script>
export default {
    name: 'Container',
    props:{
        component: Object,
        data: [Array, Object]
    }
};
</script>
