<template>
    <Page/>
</template>

<script>
export default {
    name: "index",
    middleware: ['check-user-apps'],
    meta:{
        module: 'elcar',
        section: 'messages',
        action: 'read'
    }
}
</script>

