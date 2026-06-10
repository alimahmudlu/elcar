// Initializes the `user-invitations` service on path `/user-invitations`
const { UserInvitations } = require( './user-invitations.class' );
const createModel = require( '../../../models/general/user-invitations.model' );
const hooks = require( './user-invitations.hooks' );

module.exports = function ( app ) {
    const options = {
        Model: createModel( app ),
        paginate: false,
        multi: [ 'create' ]
    };

    // Initialize our service with any options it requires
    app.use( '/user-invitations', new UserInvitations( options, app ) );

    // Get our initialized service so that we can register hooks
    const service = app.service( 'user-invitations' );

    service.hooks( hooks );
};
