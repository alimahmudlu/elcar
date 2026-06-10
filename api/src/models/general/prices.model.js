// prices-model.js - A mongoose model
//
// See http://mongoosejs.com/docs/models.html
// for more of what you can do here.
module.exports = function (app) {
    const modelName = 'prices';
    const mongooseClient = app.get('mongooseClient');
    const {Schema} = mongooseClient;
    const schema = new Schema({
        name: {
            type: String,
            required: true,
        },
        amount: {
            type: Number,
            required: true,
        },
        duration: {
            type: Number,
            required: true,
        },
        currency: {
            type: Schema.Types.ObjectId,
            ref: 'currencies',
            required: true,
        }
    }, {
        versionKey: false,
        id: false,
    });

    schema.pre('find', function (next) {
        this.populate([{path: 'currency', model: 'currencies'}]);
        next();
    });

    // This is necessary to avoid model compilation errors in watch mode
    // see https://mongoosejs.com/docs/api/connection.html#connection_Connection-deleteModel
    if (mongooseClient.modelNames().includes(modelName)) {
        mongooseClient.deleteModel(modelName);
    }
    return mongooseClient.model(modelName, schema);

};
