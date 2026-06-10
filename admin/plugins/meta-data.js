import { name, baseUrl, meta, theme } from '../structure/app'

export default (ctx) => {

    const locale = ctx.$i18n.locale
    const appName = name[locale]
    const title = meta.title[locale]
    const description = meta.description[locale]

    const i18nHead = ctx.$nuxtI18nHead({ addSeoAttributes: true })

    return {
        htmlAttrs: {
            // lang: locale
            ...i18nHead.htmlAttrs,
            id: 'html'
        },
        bodyAttrs: {
            id: 'body'
        },
        title: appName,
        titleTemplate: `%s • ${title}`,
        meta: [
            {charset: 'utf-8'},
            {name: 'viewport', content: 'width=device-width, initial-scale=1'},
            {hid: 'description', name: 'description', content: description},

            {name: 'language', content: locale},
            {name: 'content-language', content: locale},
            {name: 'format-detection', content: 'telephone=no'},
            {name: 'theme-color', content: theme.colors.light.primary},

            {
                name: 'copyright',
                content: appName + ' 2023 - ' + new Date().getFullYear() + ' © ' + ctx.$t('All right reserved')
            },
            ...i18nHead.meta
        ],
        link: [
            // {rel: 'icon', type: 'image/png', href: theme?.icons?.favicon?.src},
            {rel: 'dns-prefetch', href: baseUrl},
            {rel: 'dns-prefetch', href: '//fonts.googleapis.com'},
            {rel: 'dns-prefetch', href: '//fonts.gstatic.com'},
            {rel: 'dns-prefetch', href: '//www.googletagmanager.com'},
            {rel: 'dns-prefetch', href: '//stats.g.doubleclick.net'},
            {rel: 'dns-prefetch', href: '//cdn.jsdelivr.net'},
            ...i18nHead.link
        ]
    }
}

