const { authenticate } = require('@feathersjs/authentication').hooks;
const { hashPassword, protect } = require('@feathersjs/authentication-local').hooks;

const createUserProfile = require('../../../hooks/create-user-profile');
const updateUserProfile = require('../../../hooks/update-user-profile');
const removeUserProfile = require('../../../hooks/remove-user-profile');
const checkUserPassword = require('../../../hooks/check-user-password');
const getUsers = require('../../../hooks/get-users');

module.exports = {
    before: {
        all: [],
        find: [ authenticate('jwt'), getUsers() ],
        get: [ authenticate('jwt') ],
        create: [ hashPassword('password') ],
        update: [ authenticate('jwt'), checkUserPassword(), hashPassword('password') ],
        patch: [ authenticate('jwt'), checkUserPassword(), hashPassword('password'), ],
        remove: [ authenticate('jwt') ]
    },

    after: {
        all: [ protect('password') ],
        find: [],
        get: [],
        create: [ createUserProfile() ],
        update: [ updateUserProfile() ],
        patch: [ updateUserProfile() ],
        remove: [ removeUserProfile() ]
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
