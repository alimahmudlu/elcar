// Initializes the `user-modules` service on path `/user-modules`
const { UserModules } = require('./user-modules.class');
const createModel = require('../../../models/general/user-modules.model');
const hooks = require('./user-modules.hooks');

module.exports = function (app) {
  const options = {
    Model: createModel(app),
    paginate: false, //app.get('paginate')
  };

  // Initialize our service with any options it requires
  app.use('/user-modules', new UserModules(options, app));

  // Get our initialized service so that we can register hooks
  const service = app.service('user-modules');

  service.hooks(hooks);
};
