<template>
    <Page/>
</template>

<script>
export default {
    name: "index",
    middleware: ['check-user-apps'],
    meta:{
        module: 'general',
        section: null,
        action: 'read'
    },
}
</script>
