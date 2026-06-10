// Initializes the `app-modules` service on path `/app-modules`
const { AppModules } = require('./app-modules.class');
const createModel = require('../../../models/general/app-modules.model');
const hooks = require('./app-modules.hooks');

module.exports = function (app) {
  const options = {
    Model: createModel(app),
    paginate: false
  };

  // Initialize our service with any options it requires
  app.use('/app-modules', new AppModules(options, app));

  // Get our initialized service so that we can register hooks
  const service = app.service('app-modules');

  service.hooks(hooks);
};
