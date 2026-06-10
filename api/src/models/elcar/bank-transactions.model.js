// bank-transactions-model.js - A mongoose model
//
// See http://mongoosejs.com/docs/models.html
// for more of what you can do here.
module.exports = function (app) {
    const modelName = 'bank_transactions';
    const mongooseClient = app.get('mongooseClient');
    const {Schema} = mongooseClient;
    const schema = new Schema({
        order: {
            type: Schema.Types.ObjectId,
            ref: 'orders',
            required: true,
        },
        operation: {
            type: String,
            required: true
        },
        status: {
            type: String,
            required: true
        },
        bank: {
            type: Schema.Types.Mixed,
            required: true
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
