const { authenticate } = require('@feathersjs/authentication').hooks;
const { authorize } = require('feathers-casl').hooks;
const checkAbilities = require('../../../hooks/check-abilities');

const { cache } = require('feathers-hooks-common');
const CacheMap = require('@feathers-plus/cache');
const cacheMap = CacheMap({ max: 100 });

module.exports = {
    before: {
        all: [ authenticate('jwt'), checkAbilities(), authorize({ adapter: 'feathers-mongoose' }), cache(cacheMap) ],
        find: [],
        get: [],
        create: [],
        update: [],
        patch: [],
        remove: []
    },

    after: {
        all: [ cache(cacheMap) ],
        find: [],
        get: [],
        create: [],
        update: [],
        patch: [],
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
