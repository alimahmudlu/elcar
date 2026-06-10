const errors = require('@feathersjs/errors');
const bcrypt = require('bcryptjs');

// eslint-disable-next-line no-unused-vars
module.exports = ( options = {} ) => {
    return async context => {

        if (context.data.password) {

            const isValidPassword = await bcrypt.compare(context.data.password, context.params.user.password);

            if (!isValidPassword) {
                throw new errors.NotAuthenticated('Invalid current password');
            }

            if (context.data.newPassword) {
                context.data.password = context.data.newPassword;
            }
        }

        return context;
    };
};
