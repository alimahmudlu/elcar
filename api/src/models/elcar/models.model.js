// models-model.js - A mongoose model
//
// See http://mongoosejs.com/docs/models.html
// for more of what you can do here.
module.exports = function ( app ) {
    const modelName = 'models';
    const mongooseClient = app.get( 'mongooseClient' );
    const { Schema } = mongooseClient;
    const schema = new Schema( {
        name: {
            type: String,
            required: true
        },
        slug: {
            type: String,
            required: true
        },
        brand: {
            type: Schema.Types.ObjectId,
            ref: 'brands',
        },
        section: {
            type: String,
            required: true
        },
    }, {
        timestamps: false,
        versionKey: false,
        id: false
    } );

    schema.pre('find', function (next) {
        this.populate([
            {
                path: "brand",
                model: "brands",
                select: 'name'
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
