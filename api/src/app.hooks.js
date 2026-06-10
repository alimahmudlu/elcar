const paginateData = require('./hooks/paginate-data');
const setQueries = require('./hooks/set-queries');

module.exports = {
    before: {
        all: [],
        find: [setQueries()],
        get: [],
        create: [],
        update: [],
        patch: [],
        remove: []
    },

    after: {
        all: [],
        find: [paginateData()],
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
