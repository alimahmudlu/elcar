const errors = require('@feathersjs/errors');

// eslint-disable-next-line no-unused-vars
module.exports = (options = {}) => {
    return async context => {
        try {

            if (context.path === 'auth/user') {
                context.result = await context.app.service('users').get(context.params.user._id);
            } else {
                if (typeof context.arguments[0].authenticated !== 'boolean') {

                    const { query, user } = context.params;

                    const roleQuery = {
                        $and: [
                            { key: { $ne: 'root' } }
                        ]
                    };

                    if (query.role) {
                        roleQuery.$and.push({ key: query.role });
                        delete query.role;
                    }

                    const roles = await context.app.service('roles').Model.find(roleQuery);

                    const roleIds = roles.map(role => role._id.toString());

                    const accesses = await context.app.service('user-access').Model.find({ role: roleIds });

                    const accessIds = accesses.map(access => access._id.toString());

                    context.params.query = {
                        ...query,
                        currentAccess: {
                            $in: accessIds
                        }
                    };

                    if (user.currentAccess.workspace) {
                        context.params.query.workspace = user.currentAccess.workspace._id;
                    }

                    if(!['root', 'owner'].includes(user.currentAccess.role.key)){
                        context.params.query.teams = user.teams
                    }
                }
            }

            return context;

        } catch (error) {
            throw new errors.GeneralError(error);
        }
    };
};
