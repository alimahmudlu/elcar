import { locales, baseUrl } from '../structure/app'
import allPages from '../structure/pages'

const pages = {}

allPages.forEach(page => {
    if(page.config.route.i18n){
        pages[page.config.route.i18n.path] = page.config.route.i18n.slug
    }
})

const i18n = {
    defaultLocale: locales.default,
    locale: locales.default,
    locales: locales.list,
    lazy: true,
    langDir: 'lang/',
    vuex: {
        syncLocale: true,
    },
    seo: true,
    baseUrl,
    detectBrowserLanguage: false,
    intervalPlural: true,
    parsePages: false,
    pages
}

export default i18n
