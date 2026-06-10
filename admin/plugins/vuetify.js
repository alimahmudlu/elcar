import { locales, theme } from '../structure/app'
const {colors} = theme

locales.list.forEach(locale => {
    require(`vuetify/src/locale/${ locale.code }`)
})

export default {
    customVariables: [ '~/assets/variables.scss' ],
    defaultAssets: false,
    treeShake: true,
    icons: {
        iconfont: 'mdi',
    },
    lang: {
        current: locales.default
    },
    theme: {
        dark: false,
        options: {
            customProperties: true,
            cspNonce: 'dQw4w9WgXcQ',
        },
        themes: {
            light: {
                primary: colors.light.primary,
                lighten: colors.light.lighten,
            },
            dark: {
                primary: colors.dark.primary,
                lighten: colors.dark.lighten,
            },
        },
    }
}
