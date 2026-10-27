// Initializes the `reviews` service on path `/reviews`
const { Reviews } = require('./reviews.class');
const createModel = require('../../../models/elcar/reviews.model');
const hooks = require('./reviews.hooks');

module.exports = function (app) {
    const options = {
        Model: createModel(app),
        paginate: app.get('paginate'),
        whitelist: ['$populate']
    };

    // Initialize our service with any options it requires
    app.use('/reviews', new Reviews(options, app));
    app.use('/site/reviews', new Reviews(options, app));

    // Get our initialized service so that we can register hooks
    const service = app.service('reviews');
    const siteService = app.service('site/reviews');

    service.hooks(hooks);
    siteService.hooks(hooks);
};
