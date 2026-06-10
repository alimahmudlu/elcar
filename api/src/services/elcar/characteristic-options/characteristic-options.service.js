// Initializes the `characteristic-options` service on path `/characteristic-options`
const { CharacteristicOptions } = require('./characteristic-options.class');
const createModel = require('../../../models/elcar/characteristic-options.model');
const hooks = require('./characteristic-options.hooks');

module.exports = function (app) {
    const options = {
        Model: createModel(app),
        paginate: app.get('paginate')
    };

    // Initialize our service with any options it requires
    app.use('/characteristic-options', new CharacteristicOptions(options, app));
    app.use('/site/characteristic-options', new CharacteristicOptions(options, app));

    // Get our initialized service so that we can register hooks
    const service = app.service('characteristic-options');
    const siteService = app.service('site/characteristic-options');

    service.hooks(hooks);
    siteService.hooks(hooks);
};
