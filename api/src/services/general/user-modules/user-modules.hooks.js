const {authenticate} = require('@feathersjs/authentication').hooks;
const {authorize} = require('feathers-casl').hooks;
const checkAbilities = require('../../../hooks/check-abilities');
const setLean = require('../../../hooks/set-lean');

const {cache} = require('feathers-hooks-common');
const CacheMap = require('@feathers-plus/cache');
const cacheMap = CacheMap({max: 100});

module.exports = {
    before: {
        all: [ authenticate( 'jwt' ), checkAbilities(), authorize( { adapter: 'feathers-mongoose' } ), setLean(), cache( cacheMap ) ],
        find: [],
        get: [],
        create: [],
        update: [],
        patch: [],
        remove: []
    },

    after: {
        all: [cache(cacheMap)],
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
