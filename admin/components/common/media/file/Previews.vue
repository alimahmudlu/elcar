<template>
    <v-row dense :justify="justify" class="transition-swing">
        <v-col :cols="multiple ? $vuetify.breakpoint.xsOnly ? 4 : null : 6" :sm="!multiple && (size || 4)" :md="!multiple && (size || 2)"
               :class="{'mt-2': edit}" :style="multiple && `max-width: 170px; min-width: 90px`"
               v-for="(file, i) in filePreviews" :key="`file-${i}`">

            <v-hover v-slot="{hover}">
                <div class="relative">

                    <div class="absolute z-index-1 right-0 top-0 pa-1" v-if="hover && edit">
                        <v-btn fab x-small depressed dark color="red" width="24" height="24"
                               @click="$emit('delete', file._id)">
                            <Icon name="mdiClose"/>
                        </v-btn>
                    </div>

                    <v-img :lazy-src="$img($src(file.src), {width: 10, quality: 50 })"
                           :src="$img($src(file.src), {width: 100, height: 100, quality: 70 })"
                           class="fill-width rounded lighten" contain :aspect-ratio="1"
                           content-class="d-flex align-center justify-center"/>

                </div>
            </v-hover>
        </v-col>
    </v-row>
</template>

<script>
export default {
    name: 'SelectedFiles',

    props:{
        previews: Array,
        edit: Boolean,
        multiple: Boolean,
        size: [Number, String],
        limit: [Number, String],
        justify: String,
    },

    computed:{
        filePreviews(){
            if(this.limit && this.previews?.length > parseInt(this.limit)){
                return this.previews.slice(0, parseInt(this.limit))
            }else{
                return this.previews
            }
        }
    }
};
</script>
