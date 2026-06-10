import { defineRouting } from 'next-intl/routing';

export const routing = defineRouting({
    // A list of all locales that are supported
    locales: ['az', 'en', 'ru'],

    // Used when no locale matches
    defaultLocale: 'az',

    // Don't show the default locale (az) in the URL
    localePrefix: 'as-needed',

    // Locale detection'ı devre dışı bırak
    localeDetection: false

});