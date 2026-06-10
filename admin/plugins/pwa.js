import { baseUrl, name, meta, locales, pwa, theme } from '../structure/app'
const {colors} = theme, lang = locales.default

export default {
    manifest: {
        lang,
        scope: '/',
        start_url: baseUrl,

        short_name: name[lang],
        description: meta.description[lang],
        categories: pwa.categories[lang],

        screenshots: pwa.screenshots,
        shortcuts: pwa.shortcuts,
        theme_color: pwa.themeColor || colors.light.primary,
        background_color: pwa.backgroundColor || colors.light.background,

        display: "standalone",
        mobileAppIOS: true,
        appleStatusBarStyle: "black-translucent",
        $schema: "https://json.schemastore.org/web-manifest-combined.json",
    },
}
