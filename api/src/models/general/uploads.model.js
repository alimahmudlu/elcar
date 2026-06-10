// uploads-model.js - A mongoose model
//
// See http://mongoosejs.com/docs/models.html
// for more of what you can do here.
module.exports = function (app) {
    const modelName = 'uploads';
    const mongooseClient = app.get('mongooseClient');
    const {Schema} = mongooseClient;
    const schema = new Schema({
        name: String,
        alt: String,
        src: String,
        width: Number,
        height: Number,
        size: Number,
        extension: String,
        type: String,
        folder: {
            type: Schema.Types.ObjectId,
            ref: 'file_folders',
            default: null
        },
        modules: {
            type: [Schema.Types.ObjectId],
            ref: 'app_modules',
            default: []
        },
        workspace: {
            type: Schema.Types.ObjectId,
            ref: 'workspaces'
        },
        createdBy: {
            type: Schema.Types.ObjectId,
            ref: 'users'
        },
    }, {
        timestamps: true,
        versionKey: false,
        id: false,
        toJSON: {
            virtuals: true,
        }
    });

    schema.pre('find', function (next) {
        this.select('-updatedAt -createdAt -createdBy -modules -workspace');

        next();
    });

    // This is necessary to avoid model compilation errors in watch mode
    // see https://mongoosejs.com/docs/api/connection.html#connection_Connection-deleteModel
    if (mongooseClient.modelNames().includes(modelName)) {
        mongooseClient.deleteModel(modelName);
    }
    return mongooseClient.model(modelName, schema);

};
