// messages-model.js - A mongoose model
//
// See http://mongoosejs.com/docs/models.html
// for more of what you can do here.
module.exports = function (app) {
    const modelName = 'messages';
    const mongooseClient = app.get('mongooseClient');
    const { Schema } = mongooseClient;
    const schema = new Schema({
        fullName: {
            type: String,
            required: true,
            validate: {
                validator: function(v) {
                    const regex = /^[\sa-zA-Z]*$/;
                    return regex.test(v)
                },
                message: 'Please enter a valid full name'
            }
        },
        email: {
            type: String,
            required: true,
            trim: true,
            validate: {
                validator: function(v) {
                    return /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/.test(v);
                },
                message: "Please enter a valid email"
            },
        },
        phone: {
            type: String,
            required: true,
            // validate: {
            //     validator: function(v) {
            //         return /^(\((\+))?\d{3}(\s)(\b10\b|\b12\b|\b18\b|\b50\b|\b51\b|\b55\b|\b70\b|\b77\b|\b99\b)\)(\))?(-|\s)?\d{3}(-|\s)\d{2}(-|\s)\d{2}$/.test(v);
            //     },
            //     message: "Please enter a valid phone"
            // },
        },
        message: {
            type: String,
            required: true,
            min: 10
        },
        seen: {
            type: Boolean,
            default: false
        },
    }, {
        timestamps: true,
        versionKey: false,
        id: false
    });

    // This is necessary to avoid model compilation errors in watch mode
    // see https://mongoosejs.com/docs/api/connection.html#connection_Connection-deleteModel
    if (mongooseClient.modelNames().includes(modelName)) {
        mongooseClient.deleteModel(modelName);
    }
    return mongooseClient.model(modelName, schema);

};
