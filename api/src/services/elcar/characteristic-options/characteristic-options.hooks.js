const { authenticate } = require('@feathersjs/authentication').hooks;
const { authorize } = require('feathers-casl').hooks;
const { iff } = require('feathers-hooks-common');
const allowForSite = require('../../../hooks/allow-for-site');
const checkAbilities = require('../../../hooks/check-abilities');
const { cache } = require('feathers-hooks-common');
const CacheMap = require('@feathers-plus/cache');
const cacheMap = CacheMap({ max: 100 });

const beforeContentSave = require('../../../hooks/before-content-save');
const setLean = require('../../../hooks/set-lean');
const setLanguage = require('../../../hooks/set-language');
const sortData = require('../../../hooks/sort-data');

module.exports = {
    before: {
        all: [],
        find: [ iff(allowForSite()).else(authenticate('jwt'), checkAbilities(), authorize({ adapter: 'feathers-mongoose' }), sortData()), setLean(), cache(cacheMap) ],
        get: [ iff(allowForSite(), setLean()).else(authenticate('jwt'), checkAbilities(), authorize({ adapter: 'feathers-mongoose' }), setLean({ lean: true })), cache(cacheMap) ],
        create: [ authenticate('jwt'), checkAbilities(), authorize({ adapter: 'feathers-mongoose' }), beforeContentSave() ],
        update: [ authenticate('jwt'), checkAbilities(), authorize({ adapter: 'feathers-mongoose' }), beforeContentSave() ],
        patch: [ authenticate('jwt'), checkAbilities(), authorize({ adapter: 'feathers-mongoose' }), beforeContentSave() ],
        remove: [ authenticate('jwt'), checkAbilities(), authorize({ adapter: 'feathers-mongoose' }) ]
    },

    after: {
        all: [ cache(cacheMap) ],
        find: [ setLanguage() ],
        get: [ iff(allowForSite(), setLanguage()) ],
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
