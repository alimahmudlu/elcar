// Initializes the `categories` service on path `/categories`
const { Categories } = require('./categories.class');
const createModel = require('../../../models/elcar/categories.model');
const hooks = require('./categories.hooks');

module.exports = function (app) {
    const options = {
        Model: createModel(app),
        paginate: false,
        whitelist: ['$skip']
    };

    // Initialize our service with any options it requires
    app.use('/categories', new Categories(options, app));
    app.use('/site/categories', new Categories(options, app));

    // Get our initialized service so that we can register hooks
    const service = app.service('categories');
    const siteService = app.service('site/categories');

    service.hooks(hooks);
    siteService.hooks(hooks);
};
