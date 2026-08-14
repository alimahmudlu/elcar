import { defineRouting } from 'next-intl/routing';

export const routing = defineRouting({
    // A list of all locales that are supported
    locales: ['az', 'en', 'ru'],

    // Used when no locale matches
    defaultLocale: 'az',

    // Dil prefiksi hemise URL-de qalsin (SEO: duplicate content ve hreflang ucun)
    localePrefix: 'always',

    // Locale detection'ı devre dışı bırak
    localeDetection: false

});