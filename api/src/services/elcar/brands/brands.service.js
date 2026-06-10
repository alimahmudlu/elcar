// Initializes the `brands` service on path `/brands`
const { Brands } = require('./brands.class');
const createModel = require('../../../models/elcar/brands.model');
const hooks = require('./brands.hooks');

module.exports = function (app) {
    const options = {
        Model: createModel(app),
        paginate: false
    };

    // Initialize our service with any options it requires
    app.use('/brands', new Brands(options, app));
    app.use('/site/brands', new Brands(options, app));

    // Get our initialized service so that we can register hooks
    const service = app.service('brands');
    const siteService = app.service('site/brands');

    service.hooks(hooks);
    siteService.hooks(hooks);
};
