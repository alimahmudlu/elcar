const { authenticate } = require( '@feathersjs/authentication' ).hooks;
const { authorize } = require( 'feathers-casl' ).hooks;
const sortData = require( '../../../hooks/sort-data' );
const checkAbilities = require( '../../../hooks/check-abilities' );
const setLean = require('../../../hooks/set-lean');
const setLanguage = require('../../../hooks/set-language');

const { cache } = require( 'feathers-hooks-common' );
const CacheMap = require( '@feathers-plus/cache' );
const cacheMap = CacheMap( { max: 100 } );
const { sendMail } = require( '../../../mail' );
const { invitation } = require( '../../../email-templates' );

const setMulti = ()=> {
    return async context => {

        if(!Array.isArray(context.data)){
            context.data = [context.data]
        }

        const usersModel = context.app.service('users').Model

        context.data = await Promise.all(context.data.map(async item => {

            if(!item.user){
                const user = await usersModel.findOne({email: item.email})
                if(user){item.user = user._id}
            }

            return item
        }))

        return context
    }
}

const sendToMail = () => {
    return async context => {

        const usersModel = context.app.service('users').Model
        const workspacesModel = context.app.service('workspaces').Model
        const rolesModel = context.app.service('roles').Model
        const boardModel = context.app.service('boards').Model

        context.result = await Promise.all(context.result.map(async item => {

            try {

                const user = await usersModel.findOne({email: item.email})
                const createdBy = await usersModel.findById(item.createdBy)
                const workspace = await workspacesModel.findById(item.workspace)
                const role = await rolesModel.findById(item.role)
                const board = await boardModel.findById(item.board)
                const template = await invitation({ createdBy, workspace, user, role, item, board })

                const newMail = await sendMail( {
                    to: item.email,
                    subject: 'Invitation',
                    template,
                } );

            }catch ( error ) {
                console.log(error);
            }

            return item
        }))

        return context
    }
}

const changeStatus = ()=> {
    return async context => {

        if(context.result.status === 'accepted'){

            const modulePermissionsModel = context.app.service( 'module-permissions' ).Model;
            const userAccessModel = context.app.service( 'user-access' ).Model;
            const authUsersService = context.app.service( 'users' );

            const modulePermissions = await modulePermissionsModel.find( {
                role: context.result.role,
                module: context.result.modules
            });

            const modulePermissionIds = modulePermissions?.map(permission => permission._id)

            // Create new User Access by Invitation
            const userAccess = await userAccessModel.create( {
                user: context.result.user,
                role: context.result.role,
                workspace: context.result.workspace,
                permissions: modulePermissionIds,
            } );

            // Set new Access to User
            await authUsersService.patch( context.result.user, {
                $push: {accessList : userAccess._id }
            } );

            if(context.result.board){

                const boardModel = context.app.service( 'boards' );

                await boardModel.patch( context.result.board, {
                    $push: {assignees : context.result.user }
                } );

            }
        }

        return context
    }
}

module.exports = {
    before: {
        all: [ authenticate( 'jwt' ), checkAbilities(), authorize( { adapter: 'feathers-mongoose' } ), sortData(), cache( cacheMap ) ],
        find: [setLean()],
        get: [setLean()],
        create: [setMulti()],
        update: [],
        patch: [],
        remove: []
    },

    after: {
        all: [ cache( cacheMap ) ],
        find: [],
        get: [setLanguage()],
        create: [sendToMail()],
        update: [changeStatus()],
        patch: [changeStatus()],
        remove: []
    },

    error: {
        all: [],
        find: [],
        get: [],
        create: [],
        update: [],
        patch: [],
        remove: []
    }
};
