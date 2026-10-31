const { authenticate } = require('@feathersjs/authentication').hooks;
const { authorize } = require('feathers-casl').hooks;
const { iff } = require('feathers-hooks-common');
const allowForSite = require('../../../hooks/allow-for-site');
const checkAbilities = require('../../../hooks/check-abilities');
const { cache } = require('feathers-hooks-common');
const CacheMap = require('@feathers-plus/cache');
const cacheMap = CacheMap({ max: 100 });
const sendEmail = require('../../../hooks/send-message-to-email');
const sortData = require('../../../hooks/sort-data');
const rateLimit = require('../../../hooks/rate-limit');

module.exports = {
    before: {
        all: [],
        find: [ authenticate('jwt'), checkAbilities(), authorize({ adapter: 'feathers-mongoose' }), sortData(), cache(cacheMap) ],
        get: [ authenticate('jwt'), checkAbilities(), authorize({ adapter: 'feathers-mongoose' }), sortData(), cache(cacheMap) ],
        // Saytdan: bir IP-dən 10 dəqiqədə ən çox 5 mesaj (əlaqə + təklif sorğusu)
        create: [ iff(allowForSite({ methods: [ 'create' ] }), rateLimit({ key: 'messages', max: 5 })).else(authenticate('jwt'), checkAbilities(), authorize({ adapter: 'feathers-mongoose' })) ],
        update: [ authenticate('jwt'), checkAbilities(), authorize({ adapter: 'feathers-mongoose' }) ],
        patch: [ authenticate('jwt'), checkAbilities(), authorize({ adapter: 'feathers-mongoose' }) ],
        remove: [ authenticate('jwt'), checkAbilities(), authorize({ adapter: 'feathers-mongoose' }) ]
    },

    after: {
        all: [ cache(cacheMap) ],
        find: [],
        get: [],
        create: [sendEmail()],
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
