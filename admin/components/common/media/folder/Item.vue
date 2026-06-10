<template>
    <v-hover v-slot="{hover}">
        <v-card flat :elevation="hover || !data ? 16 : 1" rounded="lg" ripple
                class="folder-item file-folder d-flex fill-height overflow-hidden transition-fast-in-fast-out relative">

            <div class="pa-4 d-flex flex-column fill-height flex-fill" @click="()=> itemProps.getFolder(data._id)">

                <div class="d-flex align-center mb-3 pr-8">

                    <v-btn tag="span" icon large class="v-btn--active rounded-lg mr-4" v-if="data">
                        <Icon name="mdiFolder"/>
                    </v-btn>

                    <v-skeleton-loader type="image" width="44" height="44" min-width="44" class="mr-4 rounded-lg"
                                       :light="!$dark()" v-else/>

                    <h2 class="font-weight-bold text-body-1 fill-width lh-1-3 line-clamp line-1" v-text="data.name" v-if="data"/>

                    <div v-else class="fill-width">
                        <v-skeleton-loader type="list-item" class="pa-0" :light="!$dark()"/>
                    </div>

                </div>

                <v-divider class="mt-4"/>

                <div class="d-flex pt-4 grey--text">

                    <span class="d-flex align-center lh-1 text-caption">

                        <Icon name="mdiFolderMultiple" left x-small/>

                        <template v-if="data">{{$tc('_ folders', data.folders || 0, {n: data.folders || 0})}}</template>

                        <v-skeleton-loader type="list-item" class="pa-0 transparent" width="80" :light="!$dark()" v-else/>

                    </span>

                    <span class="d-flex align-center lh-1 text-caption ml-6">

                        <Icon name="mdiFileMultiple" left x-small/>

                        <template v-if="data">{{$tc('_ files', data.files || 0, {n: data.files || 0})}}</template>

                        <v-skeleton-loader type="list-item" class="pa-0 transparent" width="80" :light="!$dark()" v-else/>

                    </span>

                </div>

            </div>

            <MediaFolderActionsMenu :data="data" :itemProps="itemProps"/>

        </v-card>
    </v-hover>
</template>

<script>

export default {
    name: 'MediaFolderItem',
    props:{
        component: Object,
        data: Object,
        itemProps: Object
    },
};
</script>
