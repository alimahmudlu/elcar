// user-access-model.js - A mongoose model
//
// See http://mongoosejs.com/docs/models.html
// for more of what you can do here.
module.exports = function ( app ) {
    const modelName = 'user_access';
    const mongooseClient = app.get( 'mongooseClient' );
    const { Schema } = mongooseClient;
    const schema = new Schema( {
        user: {
            type: Schema.Types.ObjectId,
            ref: 'users',
            required: true
        },
        workspace: {
            type: Schema.Types.ObjectId,
            ref: 'workspaces',
        },
        role: {
            type: Schema.Types.ObjectId,
            ref: 'roles',
            required: true
        },
        permissions: {
            type: [Schema.Types.ObjectId],
            ref: 'module_permissions',
        },
    }, {
        timestamps: true,
        versionKey: false,
        id: false,
    } );

    schema.pre('findOne', function (next) {
        this.select('-createdAt -updatedAt').populate([]);

        next();
    });

    // This is necessary to avoid model compilation errors in watch mode
    // see https://mongoosejs.com/docs/api/connection.html#connection_Connection-deleteModel
    if ( mongooseClient.modelNames().includes( modelName ) ) {
        mongooseClient.deleteModel( modelName );
    }
    return mongooseClient.model( modelName, schema );

};
