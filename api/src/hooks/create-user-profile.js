const errors = require('@feathersjs/errors');

// eslint-disable-next-line no-unused-vars
module.exports = (options = {}) => {
    return async context => {

        const payload = context.arguments[0];

        const authLoginService = context.app.service('auth/login');
        const workspacesService = context.app.service('workspaces');
        const userAccessService = context.app.service('user-access');
        const authUsersModel = context.app.service('users').Model;
        const rolesModel = context.app.service('roles').Model;
        const userModulesService = context.app.service('user-modules').Model;
        const modulePermissionsModel = context.app.service('module-permissions').Model;
        const appModulesModel = context.app.service('app-modules').Model;
        const defaultPricePlanModel = context.app.service('price-plans').Model;

        /*========================================================================================================*/
        // GET USER & ACCESS TOKEN
        /*========================================================================================================*/

        const { user, accessToken } = await authLoginService.create({ strategy: 'local', ...payload })

        let workspace = payload.workspace, userModules = [], userAccess;

        let role = await rolesModel.findOne({ key: payload.role });
        const isRoot = role.key === 'root';
        const isOwner = role.key === 'owner';

        try {

            if (user && accessToken) {

                context.params.headers.authorization = 'Bearer ' + accessToken;

                const modulePermissions = async (role, module) => {
                    const permissions = await modulePermissionsModel.find({ role, module });
                    return permissions?.map(permission => permission._id) || [];
                };

                /*====================================================================================================*/
                // CREATE OWNER WORKSPACE
                /*====================================================================================================*/

                if (isOwner && !workspace) {

                    const newWorkspace = await workspacesService.create({
                        name: payload.company || 'My workspace',
                        createdBy: user._id,
                        type: payload.type
                    });

                    workspace = newWorkspace._id;
                }

                /*========================================================================================================*/
                // CREATE OWNER MODULE
                /*========================================================================================================*/

                let modulePermissionIds = [];

                if (!isRoot) {

                    let allowedModules = payload.modules || [];

                    if (isOwner && payload.modules && !payload.workspace) {
                        await Promise.all(payload.modules.map(async module => {

                            const newOwnerModule = {
                                workspace,
                                createdBy: user._id,
                                user: user._id,
                                module
                            };

                            const defaultPricePlan = await defaultPricePlanModel.findOne({
                                default: true,
                                module
                            });

                            newOwnerModule.pricePlan = defaultPricePlan?._id || null;

                            const userModule = await userModulesService.create(newOwnerModule);

                            userModules.push(userModule._id)

                        }));
                    }

                    if(!isOwner){

                    }

                    const generalModule = await appModulesModel.findOne({ default: true });
                    modulePermissionIds = await modulePermissions(role._id, [ generalModule._id, ...allowedModules ]);

                }

                /*========================================================================================================*/
                // CREATE OWNER ACCESS
                /*========================================================================================================*/

                userAccess = await userAccessService.create({
                    user: user._id,
                    role: role._id,
                    workspace: isRoot ? null : workspace,
                    permissions: modulePermissionIds,
                });

                await authUsersModel.findByIdAndUpdate(user._id, {
                    name: payload.name,
                    surname: payload.surname,
                    accessList: [ userAccess._id ],
                    currentAccess: userAccess._id,
                    defaultAccess: userAccess._id,
                });
            }

            return context;

        }
        catch (error) {

            if(isOwner && workspace && !payload.workspace){
                await workspacesService.remove(workspace)
                await Promise.all(userModules.map(async module => await userModulesService.remove(module)))
            }

            userAccess && await userAccessService.remove(userAccess._id)

            await authUsersModel.deleteOne({_id: user._id})

            throw new errors.GeneralError(error);
        }
    };
};
