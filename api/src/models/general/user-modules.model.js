// user-modules-model.js - A mongoose model
//
// See http://mongoosejs.com/docs/models.html
// for more of what you can do here.
module.exports = function ( app ) {
    const modelName = 'user_modules';
    const mongooseClient = app.get( 'mongooseClient' );
    const { Schema } = mongooseClient;
    const schema = new Schema( {
        module: {
            type: Schema.Types.ObjectId,
            ref: 'app_modules',
        },
        pricePlan: {
            type: Schema.Types.ObjectId,
            ref: 'price_plans',
        },
        createdBy: {
            type: Schema.Types.ObjectId,
            ref: 'users',
            default: null
        },
        workspace: {
            type: Schema.Types.ObjectId,
            ref: 'workspaces',
            default: null
        },
    }, {
        timestamps: true,
        versionKey: false,
        id: false,
        toJSON: {
            virtuals: true,
        }
    } );

    schema.pre( 'find', function ( next ) {
        this.populate( [
            {
                path: 'module',
                model: 'app_modules',
                select: '-_id'
            },
            {
                path: 'pricePlan',
                model: 'price_plans',
                select: 'name _id'
            },
        ] )
        next();
    } );

    // This is necessary to avoid model compilation errors in watch mode
    // see https://mongoosejs.com/docs/api/connection.html#connection_Connection-deleteModel
    if ( mongooseClient.modelNames().includes( modelName ) ) {
        mongooseClient.deleteModel( modelName );
    }
    return mongooseClient.model( modelName, schema );

};
