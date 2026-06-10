const {authenticate} = require('@feathersjs/authentication').hooks;
const {authorize} = require('feathers-casl').hooks;
const checkAbilities = require('../../../hooks/check-abilities');

const {fastJoin, cache, makeCallingParams} = require('feathers-hooks-common');
const BatchLoader = require('@feathers-plus/batch-loader');
const {getResultsByKey, getUniqueKeys} = BatchLoader;

const CacheMap = require('@feathers-plus/cache');
const cacheMap = CacheMap({max: 100});

const sortData = require('../../../hooks/sort-data');
const deleteSubItems = require('../../../hooks/delete-sub-items');

const resolvers = {

    before: context => {
        const folders = context.app.service('file-folders');
        const files = context.app.service('uploads');
        context._loaders = {folder: {}};

        context._loaders.folder.folders = new BatchLoader(async (keys, context) => {
                const result = await folders.find(makeCallingParams(context, {folder: getUniqueKeys(keys)},
                    undefined,
                    {paginate: false}
                ));
                return getResultsByKey(keys, result, folder => folder.folder, '[!]');
            }, {context}
        );

        context._loaders.folder.files = new BatchLoader(async (keys, context) => {
                const result = await files.find(makeCallingParams(context, {folder: getUniqueKeys(keys)},
                    undefined,
                    {paginate: false}
                ));
                return getResultsByKey(keys, result, file => file.folder, '[!]');
            }, {context}
        );
    },

    joins: {
        folders: () => async (folder, context) => {
            let folders = await context._loaders.folder.folders.load(folder._id);
            return folder.folders = folders?.length || 0;
        },
        files: () => async (folder, context) => {
            let files = await context._loaders.folder.files.load(folder._id);
            return folder.files = files?.length || 0;
        }
    }
};

module.exports = {
    before: {
        all: [authenticate('jwt'), checkAbilities(), authorize({adapter: 'feathers-mongoose'}), sortData(), cache(cacheMap)],
        find: [],
        get: [],
        create: [],
        update: [],
        patch: [],
        remove: []
    },

    after: {
        all: [cache(cacheMap)],
        find: [fastJoin(resolvers)],
        get: [],
        create: [],
        update: [],
        patch: [],
        remove: [deleteSubItems({key: 'folder', modules: [{key: 'folder', service: 'uploads'}]})]
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
