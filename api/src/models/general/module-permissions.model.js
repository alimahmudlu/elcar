// module-permissions-model.js - A mongoose model
//
// See http://mongoosejs.com/docs/models.html
// for more of what you can do here.
module.exports = function (app) {
    const modelName = 'module_permissions';
    const mongooseClient = app.get('mongooseClient');
    const {Schema} = mongooseClient;
    const schema = new Schema({
        module: {
            type: Schema.Types.ObjectId,
            ref: 'app_modules',
            required: true
        },
        role: {
            type: Schema.Types.ObjectId,
            ref: 'roles',
            required: true
        },
        sections: {
            type: [Object],
            required: true
        },
    }, {
        timestamps: false,
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
