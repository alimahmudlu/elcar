// Initializes the `products` service on path `/products`
const { Products, SiteProducts } = require('./products.class');
const createModel = require('../../../models/elcar/products.model');
const hooks = require('./products.hooks');

module.exports = function (app) {
    const options = {
        Model: createModel(app),
        paginate: app.get('paginate'),
        whitelist: ['$and', '$or', '$skip', '$sort']
    };

    // Initialize our service with any options it requires
    app.use('/products', new Products(options, app));
    app.use('/site/products', new SiteProducts(options, app));

    // Get our initialized service so that we can register hooks
    const service = app.service('products');
    const siteService = app.service('site/products');

    service.hooks(hooks);
    siteService.hooks(hooks);
};
