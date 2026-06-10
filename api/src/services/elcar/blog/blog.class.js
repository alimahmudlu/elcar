const { Service } = require('feathers-mongoose');

exports.Blog = class Blog extends Service {

};

exports.SiteBlog = class SiteBlog extends Service {
    get(slug, params) {
        const lang = params.headers['content-language'], key = `slug.${lang}`;
        return this.options.Model.findOne({[key]: slug, params}).select(params.query.select);
    }
};
