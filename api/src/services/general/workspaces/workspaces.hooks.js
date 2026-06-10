const { authenticate } = require('@feathersjs/authentication').hooks;
const { authorize } = require('feathers-casl').hooks;
const checkAbilities = require('../../../hooks/check-abilities');

const { cache } = require('feathers-hooks-common');
const CacheMap = require('@feathers-plus/cache');
const cacheMap = CacheMap({ max: 100 });

module.exports = {
    before: {
        all: [ authenticate('jwt') ],
        find: [ checkAbilities(), authorize({ adapter: 'feathers-mongoose' }), cache(cacheMap) ],
        get: [ checkAbilities(), authorize({ adapter: 'feathers-mongoose' }), cache(cacheMap) ],
        create: [],
        update: [ checkAbilities(), authorize({ adapter: 'feathers-mongoose' }) ],
        patch: [ checkAbilities(), authorize({ adapter: 'feathers-mongoose' }) ],
        remove: [ checkAbilities(), authorize({ adapter: 'feathers-mongoose' }) ]
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
