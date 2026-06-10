<template>
    <v-hover v-slot="{hover}" v-if="data">
        <v-card rounded="lg" :outlined="$dark()" :elevation="hover ? 16 : 1" class="transition-fast-in-fast-out"
                :class="{'border-transparent': !hover && $dark()}"
                @dblclick="()=> itemProps.showFile(data)" ripple>

            <v-row no-gutters>

                <v-col :cols="listView ? 1 : 12" style="min-width: 60px">
                    <v-img :lazy-src="$img($src(data.src), { width: 40, quality: 70 })"
                           :src="$img( $src(data.src), { width: 330, quality: 70 } )"
                           :aspect-ratio="grid6View || (listView && $vuetify.breakpoint.smAndDown) ? 1 : 16/9" contain
                           class="rounded-lg bg-chess" :class="{'fill-height': listView}">

                        <div class="d-flex justify-space-between align-center fill-width pa-3 bg-lng-ttb" v-if="!listView">

                            <v-checkbox v-model="itemProps.files" :value="itemProps.url ? $src(data.src) : data._id"
                                        :multiple="itemProps.multiple" color="primary" class="d-flex ma-0 pa-0"
                                        :off-icon="mdiCheckboxBlankOutline" :on-icon="mdiCheckboxMarked"
                                        hide-details @change="()=> itemProps.selectFile(itemProps.files)"/>

                            <v-chip color="primary" small class="h-auto px-2" v-text="data.extension"/>

                        </div>

                    </v-img>
                </v-col>

                <v-col class="d-flex align-center rounded-lg"
                       :class="grid6View ? 'absolute bottom-0 fill-width pa-md-2 pr-md-3 pt-md-8 white--text bg-lng-btt' : 'pa-2 pa-md-4'">

                    <v-row align="center" no-gutters>

                        <v-col>
                            <span class="font-weight-bold line-clamp line-1 text-caption flex-fill" v-text="data.name"/>
                        </v-col>

                        <template v-if="listView">

                            <v-col class="text-center" style="max-width: 50px">
                                <v-chip color="lighten" small class="h-auto px-2" v-text="data.extension"/>
                            </v-col>

                            <v-col class="text-center text-caption mx-sm-3" style="max-width: 80px">
                                {{$formatBytes(data.size)}}
                            </v-col>

                            <v-col class="d-flex justify-end" style="max-width: 40px">
                                <v-checkbox v-model="itemProps.files" :value="itemProps.url ? $src(data.src) : data._id"
                                            :multiple="itemProps.multiple" color="primary" class="d-flex ma-0 pa-0"
                                            :off-icon="mdiCheckboxBlankOutline" :on-icon="mdiCheckboxMarked"
                                            hide-details @change="()=> itemProps.selectFile(itemProps.files)"/>
                            </v-col>

                        </template>

                        <v-col class="text-end" :class="{'mr-n2': !listView}" style="max-width: 36px">
                            <MediaFileActionsMenu :data="data" :dark="grid6View" :itemProps="itemProps"/>
                        </v-col>

                    </v-row>

                </v-col>

            </v-row>

        </v-card>
    </v-hover>
</template>

<script>

import {mdiCheckboxBlankOutline, mdiCheckboxMarked} from '@mdi/js';

export default {

    name: 'MediaFileItem',

    props:{
        component: Object,
        data: Object,
        itemProps: Object
    },

    data: ()=> ({
        mdiCheckboxBlankOutline,
        mdiCheckboxMarked,
    }),

    computed:{
        view(){
            return this.itemProps.view
        },

        listView(){
            return this.view === 'list'
        },

        grid4View(){
            return this.view === 'grid4'
        },

        grid6View(){
            return this.view === 'grid6'
        }
    },

    methods:{
        getUrl(id, src){

            const multiple = this.itemProps.multiple
            const files = this.itemProps.files

            return this.itemProps.getUrl((multiple && files.includes(id) || !multiple && files === id) ? this.$src(src) : null)
        }
    }
};
</script>
