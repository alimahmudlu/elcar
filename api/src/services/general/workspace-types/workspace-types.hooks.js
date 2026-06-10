const { authenticate } = require('@feathersjs/authentication').hooks;
const { authorize } = require('feathers-casl').hooks;
const checkAbilities = require('../../../hooks/check-abilities');

const { cache } = require('feathers-hooks-common');
const CacheMap = require('@feathers-plus/cache');
const cacheMap = CacheMap({ max: 100 });

const beforeContentSave = require('../../../hooks/before-content-save');
const setLean = require('../../../hooks/set-lean');
const setLanguage = require('../../../hooks/set-language');

module.exports = {
    before: {
        all: [ authenticate('jwt'), checkAbilities(), authorize({ adapter: 'feathers-mongoose' }) ],
        find: [ setLean(), cache(cacheMap) ],
        get: [ setLean({ lean: true }), cache(cacheMap) ],
        create: [ beforeContentSave({ title: 'name', alternatives: false, locale: 'en' }) ],
        update: [ beforeContentSave({ title: 'name', alternatives: false, locale: 'en' }) ],
        patch: [ beforeContentSave({ title: 'name', alternatives: false, locale: 'en' }) ],
        remove: []
    },

    after: {
        all: [],
        find: [ setLanguage(), cache(cacheMap) ],
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
