// Initializes the `characteristic-groups` service on path `/characteristic-groups`
const {CharacteristicGroups} = require('./characteristic-groups.class');
const createModel = require('../../../models/elcar/characteristic-groups.model');
const hooks = require('./characteristic-groups.hooks');

module.exports = function (app) {
    const options = {
        Model: createModel(app),
        paginate: false,
        whitelist: ['$and', '$or', '$skip', '$sort']
    };

    // Initialize our service with any options it requires
    app.use('/characteristic-groups', new CharacteristicGroups(options, app));

    // Get our initialized service so that we can register hooks
    const service = app.service('characteristic-groups');

    service.hooks(hooks);
};
