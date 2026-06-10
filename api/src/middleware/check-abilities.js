const { AbilityBuilder, createAliasResolver, makeAbilityFromRules } = require( 'feathers-casl' );

const resolveAction = createAliasResolver( {
    update: 'patch',
    read: [ 'get', 'find' ],
    delete: 'remove'
} );

const defineRulesFor = ( user, data ) => {

    const { can, cannot, rules } = new AbilityBuilder();

    switch ( user.currentAccess.role.key ) {
        case 'root':
            can( 'manage', 'all' );
            break;

        case 'owner':
            can( 'manage', 'all' );
            // can( 'manage', 'all', { workspace: user.currentAccess.workspace._id } );
            can( 'update', 'users', { email: user.email } );
            cannot( 'delete', 'workspaces', { _id: user.defaultAccess } );
            break;

        case 'admin':
        case 'user':

            userAbilities( user, can, cannot, data );

            break;
    }

    can( [ 'read', 'update' ], 'user-invitations', { user: user._id } );
    can( 'read', 'user-access', { user: user._id } );

    cannot( 'delete', 'workspaces', { _id: user.defaultAccess } );
    cannot( 'delete', 'user-access', { workspace: user.defaultAccess } );

    return rules;

};

const userAbilities = ( user, can, cannot, data ) => {
    Promise.all( user.currentAccess.permissions.map( permission => {

        can( 'read', 'user-modules', {
            workspace: user.currentAccess.workspace._id,
            module: permission.module._id
        } );

        Promise.all( permission.sections.map( section => {

                const readAction = section.actions.find( act => act.key === 'read' );

                Promise.all( section.actions.map( action => {

                        if ( action.default && readAction.default ) {
                            can( action.key, section.alias || section.key, { workspace: user.currentAccess.workspace._id } );
                        } else {
                            cannot( action.key, section.alias || section.key );
                        }

                    } )
                );

            } )
        );
    } ) );
};

const defineAbilitiesFor = ( user, data ) => {
    const rules = defineRulesFor( user, data );

    return makeAbilityFromRules( rules, { resolveAction } );
};

module.exports = {
    defineRulesFor,
    defineAbilitiesFor
};
