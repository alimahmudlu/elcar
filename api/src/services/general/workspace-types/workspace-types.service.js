// Initializes the `workspace-types` service on path `/workspace-types`
const { WorkspaceTypes } = require('./workspace-types.class');
const createModel = require('../../../models/general/workspace-types.model');
const hooks = require('./workspace-types.hooks');

module.exports = function (app) {
    const options = {
        Model: createModel(app),
        paginate: false
    };

    // Initialize our service with any options it requires
    app.use('/workspace-types', new WorkspaceTypes(options, app));

    // Get our initialized service so that we can register hooks
    const service = app.service('workspace-types');

    service.hooks(hooks);
};
