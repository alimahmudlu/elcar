<template>
    <div>
        <v-btn outlined block v-bind="$attrs"
               @click="$openDialog({
                component: 'common/media/Explorer',
                data: {
                    files,
                    query,
                    multiple,
                    callback: selectCallback,
                },
                options:{
                    fullSize: true
                }
           })">
            <Icon name="mdiFolderTableOutline" left size="20"/>
            {{ $t('From uploaded files') }}
        </v-btn>

        <MediaSelectedFiles :files="fileIds" :size="size" @files="$emit('files', $event)"/>

        <div class="pl-3 mt-1 mb-2 overflow-hidden" style="height: 14px">
            <v-slide-y-transition>
                <small v-for="(error, i) in errorMessages" :key="i" class="caption error--text d-block lh-1" v-text="error"/>
            </v-slide-y-transition>
        </div>
    </div>
</template>

<script>
export default {
    name: 'ExplorerButton',

    props: {
        files: Array,
        query: {
            type: Object,
            default: {}
        },
        multiple: Boolean,
        size: [String, Number],
        selectCallback: Function,
        errorMessages: Array,
    },
};
</script>
