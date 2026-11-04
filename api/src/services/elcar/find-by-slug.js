const { NotFound } = require('@feathersjs/errors');

const LOCALES = ['az', 'en', 'ru'];

/**
 * Sənədi slug ilə tapır: əvvəl sorğunun dilində, sonra digər dillərdə.
 * Dil dəyişdiricisi və köhnə linklər başqa dilin slug-unu göndərə bilər;
 * cavab yenə sorğunun dilində qaytarılır, sayt isə düzgün linkə yönləndirir.
 * Tapılmayanda 404 qaytarır (əvvəl növbəti hook null-da 500 verirdi).
 */
module.exports = async (slug, params, findByKey) => {
    const lang = params.headers && params.headers['content-language'];
    const order = LOCALES.includes(lang)
        ? [lang, ...LOCALES.filter(locale => locale !== lang)]
        : LOCALES;

    for (const locale of order) {
        const doc = await findByKey(`slug.${locale}`);
        if (doc) return doc;
    }

    throw new NotFound(`No record found for slug '${slug}'`);
};
