const { Service } = require('feathers-mongoose');
const findBySlug = require('../find-by-slug');

exports.Blog = class Blog extends Service {

};

exports.SiteBlog = class SiteBlog extends Service {
    get(slug, params) {
        return findBySlug(slug, params, key =>
            this.options.Model.findOne({[key]: slug}).select(params.query.select)
        )
    }
};
