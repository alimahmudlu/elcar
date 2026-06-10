// Initializes the `users` service on path `/users`
const { Users } = require( './users.class' );
const createModel = require( '../../../models/general/users.model' );
const hooks = require( './users.hooks' );

module.exports = function ( app ) {

    const options = {
        Model: createModel( app ),
        paginate: false,
        whitelist: ['$and']
    };

    // Initialize our service with any options it requires
    app.use( '/users', new Users( options, app ) );
    app.use( '/auth/user', new Users( options, app ) );

    // Get our initialized service so that we can register hooks
    const service = app.service( 'users' );
    const authUserService = app.service( 'auth/user' );

    service.hooks( hooks );
    authUserService.hooks( hooks );
};
