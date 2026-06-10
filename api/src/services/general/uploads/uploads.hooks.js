const fs = require('fs');
const path = require('path');

const {authenticate} = require('@feathersjs/authentication').hooks;
const {authorize} = require('feathers-casl').hooks;
const checkAbilities = require('../../../hooks/check-abilities');

const slugify = require('slugify');

const {cache} = require('feathers-hooks-common');
const CacheMap = require('@feathers-plus/cache');
const cacheMap = CacheMap({max: 100});

const sortData = require('../../../hooks/sort-data');

const create = () => {
    return async context => {

        const {formData} = context.data;
        const {user} = context.params;

        try {

            const images = await formData.map(img => {
                return {
                    ...img,
                    createdBy: user._id
                };
            });

            const uploadsModel = context.app.service('uploads').Model;
            context.result = await uploadsModel.insertMany(images);

            return context;

        } catch (error) {
            return error;
        }
    };
};

const update = () => {
    return async context => {

        const uploadsModel = context.app.service('uploads').Model;
        const {_id, name} = context.data;
        const file = await uploadsModel.findById(_id.toString());

        let newName = slugify(name, {replacement: '-', lower: true});
        let newPath = `uploads/files/${newName}.${file.extension}`;

        context.data.name = newName;
        context.data.src = newPath;
        context.data.old = file;

        /*Locale Server*/
        await new Promise((resolve, reject) => {

            const rootDir = path.join(__dirname, '../../../../public/');
            const oldPath = path.resolve(rootDir, `uploads/files/${file.name}.${file.extension}`);
            const renamedPath = path.resolve(rootDir, newPath);

            fs.rename(oldPath, renamedPath, (error) => {
                if (error) {
                    console.error(`Error renaming file ${oldPath}:`, error);
                    reject(error);
                } else {
                    console.log(`${oldPath} renamed to ${renamedPath}:`);
                    resolve(renamedPath);
                }
            })
        })

        return context;
    };
};

const remove = () => {
    return async context => {

        await new Promise((resolve, reject) => {

            const rootDir = path.join(__dirname, '../../../../public/');
            const oldPath = path.resolve(rootDir, context.result.src);

            fs.unlink(oldPath, (error) => {
                if (error) {
                    console.error(`Error deleting file ${oldPath}:`, error);
                    reject(error);
                } else {
                    console.log(`${oldPath} deleted`);
                    resolve(oldPath);
                }
            })
        })

        return context;
    };
};

module.exports = {
    before: {
        all: [authenticate('jwt'), checkAbilities(), authorize({adapter: 'feathers-mongoose'}), sortData(), cache(cacheMap)],
        find: [],
        get: [],
        create: [create()],
        update: [update()],
        patch: [update()],
        remove: []
    },

    after: {
        all: [cache(cacheMap)],
        find: [],
        get: [],
        create: [],
        update: [],
        patch: [],
        remove: [remove()]
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
