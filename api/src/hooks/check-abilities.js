const {defineAbilitiesFor} = require('../middleware/check-abilities');

module.exports = (options = {}) => {
    return async context => {

        const {user} = context.params;

        if(context.method === 'create' && context.path !== 'workspaces'){
            // || context.service.options.multi?.includes('create')
            if(context.service.options.multi){

                context.data = await Promise.all(context.data.map(item => {

                    const newItem = {
                        ...item,
                        workspace: null,
                        createdBy: user._id
                    }

                    if(user.currentAccess?.workspace){
                        newItem.workspace = user.currentAccess.workspace._id
                    }

                    return newItem
                }))

            }
            else{

                if(user?.currentAccess?.workspace){
                    context.data.workspace = user.currentAccess.workspace._id
                }
                context.data.createdBy = user._id
            }

        }

        const whiteList = ['user-invitations']

        /*if(user?.currentAccess?.workspace && !context.params.query.workspace && !whiteList.includes(context.path)){
            context.params.query.workspace = user.currentAccess.workspace._id
        }*/

        let data,  methods = ['patch', 'update', 'create']

        if(methods.includes(context.method)){
            data = context.data
        }

        const ability = defineAbilitiesFor(user, data);
        context.params.ability = ability
        context.params.rules = ability

        return context;
    };
};
