const { Service } = require('feathers-mongoose');
const findBySlug = require('../find-by-slug');

exports.Products = class Products extends Service {

};

exports.SiteProducts = class SiteProducts extends Service {
    get(slug, params) {
        return findBySlug(slug, params, key =>
            this.options.Model.findOne({[key]: slug}).populate(params.query.$populate).select(params.query.$select)
        )
    }
};
