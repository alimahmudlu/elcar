// Initializes the `blog` service on path `/elcar/blog`
const { Blog, SiteBlog } = require('./blog.class');
const createModel = require('../../../models/elcar/blog.model');
const hooks = require('./blog.hooks');

module.exports = function (app) {
    const options = {
        Model: createModel(app),
        paginate: app.get('paginate')
    };

    // Initialize our service with any options it requires
    app.use('/blog', new Blog(options, app));
    app.use('/site/blog', new SiteBlog(options, app));

    // Get our initialized service so that we can register hooks
    const service = app.service('blog');
    const siteService = app.service('site/blog');

    service.hooks(hooks);
    siteService.hooks(hooks);
};
