// blog-model.js - A mongoose model
//
// See http://mongoosejs.com/docs/models.html
// for more of what you can do here.
module.exports = function (app) {
    const modelName = 'blog';
    const mongooseClient = app.get('mongooseClient');
    const { Schema } = mongooseClient;
    const schema = new Schema({
        title: {
            type: String,
            required: true,
            intl: true
        },
        slug: {
            type: String,
            required: true,
            intl: true
        },
        alternatives: Schema.Types.Mixed,
        description: {
            type: String,
            required: true,
            intl: true
        },
        content: {
            type: String,
            required: true,
            intl: true
        },
        image: {
            type: Schema.Types.ObjectId,
            ref: 'uploads',
            // required: true,
        },
        top: Boolean
    }, {
        timestamps: true,
        versionKey: false,
        id: false,
        toJSON: {
            virtuals: true,
        }
    });

    schema.pre('find', function (next) {
        this.populate([
            {
                path: "image",
                model: "uploads",
                select: "src width height"
            },
        ])

        next()
    })

    schema.pre('findOne', function (next) {
        this.populate([
            {
                path: "image",
                model: "uploads",
                select: "src width height"
            },
        ])

        next()
    })

    // This is necessary to avoid model compilation errors in watch mode
    // see https://mongoosejs.com/docs/api/connection.html#connection_Connection-deleteModel
    if (mongooseClient.modelNames().includes(modelName)) {
        mongooseClient.deleteModel(modelName);
    }
    return mongooseClient.model(modelName, schema);

};
