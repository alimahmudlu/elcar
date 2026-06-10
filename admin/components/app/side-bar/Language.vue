<template>
    <v-menu transition="slide-x-transition" tile right :offset-x="!mobile" :bottom="!mobile" :top="mobile" nudge-right="20">
        
        <template #activator="{ on, attrs }">
            <v-btn icon width="40" height="40" class="pa-0 mb-md-2" min-width="auto" v-on="on" v-bind="attrs">
                <img :src="require(`@/static/flags/${$i18n.locale}.png`)" :alt="$i18n.locale" width="24" height="24"/>
            </v-btn>
        </template>
        
        <v-card tile :width="180">
            <v-list dense>
                <v-list-item v-for="locale in $i18n.locales" :key="locale.code"
                             :to="switchLocalePath(locale.code)" class="d-flex align-center"
                             @click="setLang(locale.code)">
                    
                    <v-list-item-icon class="mr-3">
                        <img :src="require(`@/static/flags/${locale.code}.png`)" :alt="locale.iso" width="24" height="24"/>
                    </v-list-item-icon>
                    
                    <v-list-item-content>
                        <v-list-item-title v-text="locale.name"/>
                    </v-list-item-content>
                
                </v-list-item>
            </v-list>
        </v-card>
    
    </v-menu>
</template>

<script>
export default {
    name: "Language",
    
    props:{
        header: Boolean,
        mobile: Boolean,
    },
    
    async created (){
        const lang = this.$storage.getCookie('lang')
        const routeLocale = this.$route.name.split('___')[1]
        this.setLang(!!lang && lang === routeLocale ? lang : routeLocale)
        this.$setState({store: 'data', key: 'contentLocale', data: !!lang && lang === routeLocale ? lang : routeLocale})
    },
    
    methods:{
        
        setLang(code){
            this.$i18n.locale = code;
            this.$vuetify.lang.current = code
            this.$axios.setHeader('Content-Language', code);
            this.$axios.setHeader('Accept-Language', code);
            this.$storage.setCookie('lang', code, {maxAge: 3600 * 24 * 365});
        },
        
        localeName(code){
            const locale = this.$i18n.locales.find(lang => lang.code === code)
            return locale?.name || this.$i18n.locale
        },
        
    }
}
</script>

