const errors = require('@feathersjs/errors');

// eslint-disable-next-line no-unused-vars
module.exports = ( options = {} ) => {
    return async context => {

        const payload = context.arguments[1];
        const user = context.result

        const rolesModel = context.app.service( 'roles' ).Model;
        const userAccessModel = context.app.service( 'user-access' ).Model;
        const modulePermissionsModel = context.app.service( 'module-permissions' ).Model;

        /*========================================================================================================*/
        // UPDATE USER PROFILE
        /*========================================================================================================*/

        try {

            const role = await rolesModel.findOne( { key: payload.role } )

            const userAccess = await userAccessModel.findOne({user: user._id, workspace: user.currentAccess.workspace._id})
            const modulePermissions = await modulePermissionsModel.find({role: role._id, module: payload.modules})

            await userAccessModel.findByIdAndUpdate(userAccess._id, {
                role: role._id,
                permissions: modulePermissions?.map(permission => permission._id)
            })

            return context;

        }catch ( error ) {
            throw new errors.GeneralError(error);
        }
    };
};
