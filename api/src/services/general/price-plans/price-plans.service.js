// Initializes the `price-plans` service on path `/price-plans`
const { PricePlans } = require('./price-plans.class');
const createModel = require('../../../models/general/price-plans.model');
const hooks = require('./price-plans.hooks');

module.exports = function (app) {
  const options = {
    Model: createModel(app),
    paginate: false
  };

  // Initialize our service with any options it requires
  app.use('/price-plans', new PricePlans(options, app));

  // Get our initialized service so that we can register hooks
  const service = app.service('price-plans');

  service.hooks(hooks);
};
