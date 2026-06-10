const errors = require('@feathersjs/errors');
const {deleteFile} = require('../s3');

module.exports = (opt = {}) => {
    return async context => {

        try {

            const {params, result} = context;
            const service = context.app.service(context.path);
            params.paginate = false;
            delete params.query.$and

            if(opt.key){
                params.query[opt.key] = result._id;
                const children = await service.find(params);
                await children.forEach(item => service.remove(item._id, params));
            }

            await Promise.all(opt.modules.map(async module => {

                //TODO Service üzərindən CASCADE parametri ilə etmək lazımdır.
                let mService = {[module.key]: context.app.service(module.service).Model}

                if(module.key === 'folder' && module.service === 'uploads'){

                    const deletedItems = await mService[module.key].find({[module.key]: result._id})

                    await Promise.all(deletedItems.map(async item => {
                        await deleteFile(item.src, context.params)
                    }))

                }

                await mService[module.key].deleteMany({[module.key]: result._id});

            }))

        } catch (error) {
            throw new errors.GeneralError(error);
        }

        return context;
    };
};
