// file-folders-model.js - A mongoose model
//
// See http://mongoosejs.com/docs/models.html
// for more of what you can do here.
module.exports = function (app) {
    const modelName = 'file_folders';
    const mongooseClient = app.get('mongooseClient');
    const {Schema} = mongooseClient;
    const schema = new Schema({
        name: {
            type: String,
            required: true
        },
        folder: {
            type: Schema.Types.ObjectId,
            ref: 'folders',
        },
        modules: {
            type: [Schema.Types.ObjectId],
            ref: 'app_modules',
            required: true
        },
        workspace: {
            type: Schema.Types.ObjectId,
            ref: 'workspaces',
            required: true
        },
        createdBy: {
            type: Schema.Types.ObjectId,
            ref: 'users',
            required: true
        },
    }, {
        timestamps: true,
        versionKey: false,
        id: false,
    });

    schema.pre('find', function (next) {
        this.select('-updatedAt -createdAt -createdBy -workspace');

        next();
    });

    // This is necessary to avoid model compilation errors in watch mode
    // see https://mongoosejs.com/docs/api/connection.html#connection_Connection-deleteModel
    if (mongooseClient.modelNames().includes(modelName)) {
        mongooseClient.deleteModel(modelName);
    }
    return mongooseClient.model(modelName, schema);

};
