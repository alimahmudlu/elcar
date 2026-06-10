// Initializes the `bank-transactions` service on path `/bank-transactions`
const { BankTransactions } = require('./bank-transactions.class');
const createModel = require('../../../models/elcar/bank-transactions.model');
const hooks = require('./bank-transactions.hooks');

module.exports = function (app) {
  const options = {
    Model: createModel(app),
    paginate: false//app.get('paginate')
  };

  // Initialize our service with any options it requires
  app.use('/bank-transactions', new BankTransactions(options, app));

  // Get our initialized service so that we can register hooks
  const service = app.service('bank-transactions');

  service.hooks(hooks);
};
