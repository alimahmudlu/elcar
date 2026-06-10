// app-modules-model.js - A mongoose model
//
// See http://mongoosejs.com/docs/models.html
// for more of what you can do here.
module.exports = function ( app ) {
    const modelName = 'app_modules';
    const mongooseClient = app.get( 'mongooseClient' );
    const { Schema } = mongooseClient;
    const schema = new Schema( {
        name: {
            type: String,
            required: true,
            intl: true
        },
        description: {
            type: String,
            required: true,
            intl: true
        },
        content: {
            type: String,
            intl: true
        },
        image: String,
        icon: String,
        color: String,
        default: {
            type: Boolean,
            default: false
        },
        key: {
            type: String,
            required: true,
        },
    }, {
        timestamps: false,
        versionKey: false,
        id: false,
        toJSON: {
            virtuals: true,
        }
    } );

    // This is necessary to avoid model compilation errors in watch mode
    // see https://mongoosejs.com/docs/api/connection.html#connection_Connection-deleteModel
    if ( mongooseClient.modelNames().includes( modelName ) ) {
        mongooseClient.deleteModel( modelName );
    }
    return mongooseClient.model( modelName, schema );

};
