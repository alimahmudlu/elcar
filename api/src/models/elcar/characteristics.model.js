// characteristics-model.js - A mongoose model
//
// See http://mongoosejs.com/docs/models.html
// for more of what you can do here.
module.exports = function ( app ) {
    const modelName = 'characteristics';
    const mongooseClient = app.get( 'mongooseClient' );
    const { Schema } = mongooseClient;
    const schema = new Schema( {
        name: {
            type: String,
            required: true,
            intl: true
        },
        key: String,
        section: String,
        categories: {
            type: [Schema.Types.ObjectId],
            ref: 'categories',
        },
        group: {
            type: Schema.Types.ObjectId,
            ref: 'characteristic_groups',
        },
        component: Object
    }, {
        timestamps: false,
        versionKey: false,
        id: false,
        toJSON: {
            virtuals: true,
        }
    } );

    schema.pre('find', function (next) {

        this.populate([
            {
                path: "categories",
                model: "categories"
            },
        ])

        next()
    })

    // This is necessary to avoid model compilation errors in watch mode
    // see https://mongoosejs.com/docs/api/connection.html#connection_Connection-deleteModel
    if ( mongooseClient.modelNames().includes( modelName ) ) {
        mongooseClient.deleteModel( modelName );
    }
    return mongooseClient.model( modelName, schema );

};
