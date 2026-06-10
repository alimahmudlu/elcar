// orders-model.js - A mongoose model
//
// See http://mongoosejs.com/docs/models.html
// for more of what you can do here.
module.exports = function (app) {
    const modelName = 'orders';
    const mongooseClient = app.get('mongooseClient');
    const { Schema } = mongooseClient;

    const product = new Schema({
        detail: {
            type: Schema.Types.ObjectId,
            ref: 'products',
            required: true
        },
        amount: Number
    })

    const schema = new Schema({
        purchaser: {
            type: String,
            required: true,
            minlength: [5, 'Minimum 3 character required'],
            /*validate: {
                validator: function(v) {
                    const regex = /^[\sa-zA-Z]*$/;
                    return regex.test(v)
                },
                message: 'Please enter a valid full name'
            }*/
        },
        phone: {
            type: String,
            required: true
        },
        email: {
            type: String,
            lowercase: true,
            trim: true
        },
        products: [product],
        note: String,
        status: {
            type: String,
            default: 'ON-PAYMENT'
        },
        seen: {
            type: Boolean,
            default: false
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
        this.populate([
            {
                path: "products",
                populate: [
                    {
                        path: "detail",
                        model: "products",
                        select: '-category -brand -model -top -section -slug -description',
                        populate: [
                            {
                                path: "image",
                                model: "uploads",
                                select: 'src',
                            }
                        ]
                    }
                ]
            },
        ])

        next()
    })

    schema.pre('findOne', function (next) {
        this.populate([
            {
                path: "products",
                populate: [
                    {
                        path: "detail",
                        model: "products",
                        select: '-category -brand -model -top -section -slug -description',
                        populate: [
                            {
                                path: "image",
                                model: "uploads",
                                select: 'src',
                            }
                        ]
                    }
                ]
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
