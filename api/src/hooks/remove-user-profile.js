const errors = require('@feathersjs/errors');

// eslint-disable-next-line no-unused-vars
module.exports = ( options = {} ) => {
    return async context => {
        try {

            const user = context.result;

            const userAccessModel = context.app.service('user-access').Model;
            const userModulesModel = context.app.service('user-modules').Model;

            await userAccessModel.deleteOne({ user: user._id });
            await userModulesModel.deleteOne({ createdBy: user._id });

            return context;

        }catch (error) {
            throw new errors.GeneralError(error);
        }
    };
};
