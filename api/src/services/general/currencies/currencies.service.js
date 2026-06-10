// Initializes the `currencies` service on path `/currencies`
const { Currencies } = require('./currencies.class');
const createModel = require('../../../models/general/currency.model');
const hooks = require('./currencies.hooks');

module.exports = function (app) {
  const options = {
    Model: createModel(app),
    paginate: false
  };

  // Initialize our service with any options it requires
  app.use('/currencies', new Currencies(options, app));

  // Get our initialized service so that we can register hooks
  const service = app.service('currencies');

  service.hooks(hooks);
};
