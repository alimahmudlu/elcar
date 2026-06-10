// Initializes the `module-permissions` service on path `/module-permissions`
const { ModulePermissions } = require('./module-permissions.class');
const createModel = require('../../../models/general/module-permissions.model');
const hooks = require('./module-permissions.hooks');

module.exports = function (app) {
  const options = {
    Model: createModel(app),
    paginate: app.get('paginate')
  };

  // Initialize our service with any options it requires
  app.use('/module-permissions', new ModulePermissions(options, app));

  // Get our initialized service so that we can register hooks
  const service = app.service('module-permissions');

  service.hooks(hooks);
};
