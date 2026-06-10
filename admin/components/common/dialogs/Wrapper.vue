<template>
    <div>
        <DialogsDialog v-for="(dialog, i) in dialogs" :dialog="dialog" :index="i" :length="dialogs.length" :key="`dialog-${i}`"/>
    </div>
</template>

<script>
export default {
    name: 'DialogsWrapper',
    computed:{
        dialogs(){
            return this.$store.state.dialogs
        }
    }
};
</script>
