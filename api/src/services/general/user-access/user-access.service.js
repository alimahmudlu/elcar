// Initializes the `user-access` service on path `/user-access`
const { UserAccess } = require('./user-access.class');
const createModel = require('../../../models/general/user-access.model');
const hooks = require('./user-access.hooks');

module.exports = function (app) {
  const options = {
    Model: createModel(app),
    paginate: false, // app.get('paginate')
  };

  // Initialize our service with any options it requires
  app.use('/user-access', new UserAccess(options, app));

  // Get our initialized service so that we can register hooks
  const service = app.service('user-access');

  service.hooks(hooks);
};
