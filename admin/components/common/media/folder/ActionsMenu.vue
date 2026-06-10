<template>
    <v-menu left>

        <template #activator="{ on, attrs }">
            <v-btn icon v-bind="attrs" v-on="on" small class="rounded top-6 ml-n10 mr-2">
                <Icon name="mdiDotsVertical" size="20"/>
            </v-btn>
        </template>

        <v-card>
            <v-list dense nav>

                <v-list-item class="d-flex min-h-auto py-1"
                             @click="$openDialog({
                                    component: 'common/media/folder/Form',
                                    data: {
                                        folder: data,
                                        activeFolder: itemProps.activeFolder,
                                        callback: itemProps.getFolders
                                    },
                                    options:{
                                        width: 400
                                    }
                               })">

                    <v-list-item-icon class="h-auto w-auto ma-0 mr-1 d-flex align-center">
                        <Icon name="mdiPencilOutline" small/>
                    </v-list-item-icon>

                    <v-list-item-title class="text-caption" v-text="$t('Edit')"/>

                </v-list-item>

                <v-list-item class="d-flex min-h-auto py-1" @click="deleteFolder(data._id)"
                             v-if="$can('delete', `${$appModule().key}-file-folders`)">

                    <v-list-item-icon class="h-auto w-auto ma-0 mr-1 d-flex align-center">
                        <Icon name="mdiDeleteOutline" small/>
                    </v-list-item-icon>

                    <v-list-item-title class="text-caption" v-text="$t('Delete')"/>

                </v-list-item>

            </v-list>
        </v-card>

    </v-menu>
</template>

<script>

import {fileMixins} from '@/mixins/file';

export default {
    name: 'FileActionsMenu',

    mixins: [fileMixins],

    props: {
        data: Object,
        itemProps: Object,
    },
};
</script>
