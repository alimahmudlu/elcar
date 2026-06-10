// Initializes the `models` service on path `/models`
const { Models } = require('./models.class');
const createModel = require('../../../models/elcar/models.model');
const hooks = require('./models.hooks');

module.exports = function (app) {
    const options = {
        Model: createModel(app),
        paginate: app.get('paginate')
    };

    // Initialize our service with any options it requires
    app.use('/models', new Models(options, app));
    app.use('/site/models', new Models(options, app));

    // Get our initialized service so that we can register hooks
    const service = app.service('models');
    const siteService = app.service('site/models');

    service.hooks(hooks);
    siteService.hooks(hooks);
};
