// user-invitations-model.js - A mongoose model
//
// See http://mongoosejs.com/docs/models.html
// for more of what you can do here.
module.exports = function ( app ) {
    const modelName = 'user_invitations';
    const mongooseClient = app.get( 'mongooseClient' );
    const { Schema } = mongooseClient;
    const afterWeek = new Date(new Date().valueOf() + 604800000)
    const schema = new Schema( {
        email: {
            type: String,
            required: true
        },
        user: {
            type: Schema.Types.ObjectId,
            ref: 'users',
        },
        role: {
            type: Schema.Types.ObjectId,
            ref: 'roles',
        },
        createdBy: {
            type: Schema.Types.ObjectId,
            ref: 'users',
            required: true
        },
        workspace: {
            type: Schema.Types.ObjectId,
            ref: 'workspaces',
            required: true,
        },
        modules: {
            type: [Schema.Types.ObjectId],
            ref: 'app_modules',
        },
        project: {
            type: Schema.Types.ObjectId,
            ref: 'projects',
        },
        status: {
            type: String,
            default: 'pending',
            enum: ['pending', 'accepted', 'rejected']
        },
        expireAt: {
            type: Date,
            default: afterWeek,
            expires: afterWeek
        }
    }, {
        timestamps: true,
        versionKey: false,
        id: false,
        toJSON: {
            virtuals: true,
        }
    } );

    schema.pre('find', function (next) {
        this.populate([
            {
                path: 'createdBy',
                select: 'name surname'
            },
            {
                path: 'modules',
                select: 'name'
            },
            {
                path: 'role',
                select: 'name',
            },
        ]);

        next();
    });

    // This is necessary to avoid model compilation errors in watch mode
    // see https://mongoosejs.com/docs/api/connection.html#connection_Connection-deleteModel
    if ( mongooseClient.modelNames().includes( modelName ) ) {
        mongooseClient.deleteModel( modelName );
    }
    return mongooseClient.model( modelName, schema );

};
