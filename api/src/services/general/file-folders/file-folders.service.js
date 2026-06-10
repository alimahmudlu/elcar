// Initializes the `file-folders` service on path `/file-folders`
const { FileFolders } = require('./file-folders.class');
const createModel = require('../../../models/general/file-folders.model');
const hooks = require('./file-folders.hooks');

module.exports = function (app) {
  const options = {
    Model: createModel(app),
    paginate: app.get('paginate')
  };

  // Initialize our service with any options it requires
  app.use('/file-folders', new FileFolders(options, app));

  // Get our initialized service so that we can register hooks
  const service = app.service('file-folders');

  service.hooks(hooks);
};
