// price-plans-model.js - A mongoose model
//
// See http://mongoosejs.com/docs/models.html
// for more of what you can do here.
module.exports = function (app) {
    const modelName = 'price_plans';
    const mongooseClient = app.get('mongooseClient');
    const {Schema} = mongooseClient;
    const schema = new Schema({
        name: {
            type: String,
            required: true,
        },
        description: {
            type: String,
            required: true,
        },
        prices: {
            type: [Schema.Types.ObjectId],
            ref: 'prices',
            required: true,
        },
        discount: {
            type: Number,
            default: 0
        },
        active: {
            type: Boolean,
            default: true
        },
        module: {
            type: Schema.Types.ObjectId,
            ref: 'app_modules',
            required: true,
        },
    }, {
        timestamps: true,
        versionKey: false,
        id: false,
    });

    // This is necessary to avoid model compilation errors in watch mode
    // see https://mongoosejs.com/docs/api/connection.html#connection_Connection-deleteModel
    if (mongooseClient.modelNames().includes(modelName)) {
        mongooseClient.deleteModel(modelName);
    }
    return mongooseClient.model(modelName, schema);

};
