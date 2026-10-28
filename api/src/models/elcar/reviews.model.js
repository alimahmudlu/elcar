// reviews-model.js - A mongoose model
//
// Müştəri rəyləri. Saytdan gələn rəy "pending" yaranır, admin təsdiq
// etdikdən ("approved") sonra saytda görünür və məhsulun reytinqinə düşür.
module.exports = function (app) {
    const modelName = 'reviews';
    const mongooseClient = app.get('mongooseClient');
    const { Schema } = mongooseClient;
    const schema = new Schema({
        product: {
            type: Schema.Types.ObjectId,
            ref: 'products',
            required: true,
            index: true
        },
        fullName: {
            type: String,
            required: true,
            trim: true,
            maxlength: 60,
            validate: {
                validator: v => /^[\p{L}\s.'-]+$/u.test(v),
                message: 'Please enter a valid full name'
            }
        },
        rating: {
            type: Number,
            required: true,
            min: 1,
            max: 5,
            validate: {
                validator: Number.isInteger,
                message: 'Rating must be a whole number from 1 to 5'
            }
        },
        text: {
            type: String,
            required: true,
            trim: true,
            minlength: 10,
            maxlength: 2000
        },
        status: {
            type: String,
            enum: [ 'pending', 'approved', 'hidden' ],
            default: 'pending',
            index: true
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
