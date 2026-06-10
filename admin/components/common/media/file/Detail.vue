<template>
    <v-navigation-drawer v-model="toggle" touchless absolute right floating clipped width="400"
                         class="pt-14 pt-md-15 elevation-3 z-index-3">
        <div class="relative fill-height d-flex flex-column">

            <div class="bg-chess">

                <v-btn icon light @click="toggle = false" class="v-btn--active absolute ma-3 z-index-1">
                    <Icon name="mdiClose"/>
                </v-btn>

                <v-img :lazy-src="$img($src(detail.src), { width: 40, quality: 70 })"
                       :src="$img( $src(detail.src), { width: 330, quality: 70 } )"
                       :aspect-ratio="4/3" contain v-if="detail"/>

            </div>

            <div class="fill-height overflow-auto pa-6 text-caption" v-if="detail">

                <v-row>
                    <v-col cols="4" class="py-1" width="30" v-text="$t('Name') + ':'"/>
                    <v-col cols="8" class="py-1 text-pre-wrap">
                        <span v-text="detail.name"/>
                        <v-btn x-small icon color="blue" class="ml-2" @click="openInNewTab">
                            <Icon name="mdiOpenInNew" small/>
                        </v-btn>
                    </v-col>
                </v-row>

                <v-row>
                    <v-col cols="4" class="py-1 text-start" v-text="$t('Extension') + ':'"/>
                    <v-col cols="8" class="py-1" v-text="'.' + detail.extension"/>
                </v-row>

                <v-row>
                    <v-col cols="4" class="py-1" v-text="$t('Dimensions') + ':'"/>
                    <v-col cols="8" class="py-1" v-text="`${detail.width}x${detail.height} px`"/>
                </v-row>

                <v-row>
                    <v-col cols="4" class="py-1" v-text="$t('Size') + ':'"/>
                    <v-col cols="8" class="py-1" v-text="$formatBytes(detail.size)"/>
                </v-row>

                <v-row>
                    <v-col cols="4" class="py-1" v-text="$t('Uploaded at') + ':'"/>
                    <v-col cols="8" class="py-1" v-text="$dayjs(detail.createdAt).format('DD MMMM YYYY, hh:mm')"/>
                </v-row>

            </div>

        </div>
    </v-navigation-drawer>
</template>

<script>
export default {
    name: 'FileDetail',
    props:{
        open: Boolean,
        detail: Object,
    },
    model:{
        prop: 'open',
        event: 'open'
    },
    computed:{
        toggle:{
            get(){
                return this.open
            },
            set(val){
                this.$emit('open', val)
            }
        }
    },

    methods:{
        openInNewTab(){
            window.open(this.$src(this.detail.src), '_blank')
        }
    }

};
</script>
