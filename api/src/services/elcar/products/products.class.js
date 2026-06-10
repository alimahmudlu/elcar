const { Service } = require('feathers-mongoose');

exports.Products = class Products extends Service {

};

exports.SiteProducts = class SiteProducts extends Service {
    get(slug, params) {
        const lang = params.headers['content-language'], key = `slug.${lang}`;
        return this.options.Model.findOne({[key]: slug}).populate(params.query.$populate).select(params.query.$select)
    }
};
