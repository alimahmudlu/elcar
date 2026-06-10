// products-model.js - A mongoose model
//
// See http://mongoosejs.com/docs/models.html
// for more of what you can do here.
module.exports = function (app) {
    const modelName = 'products';
    const mongooseClient = app.get('mongooseClient');
    const { Schema } = mongooseClient;
    const schema = new Schema({
        section: String,
        category: {
            type: Schema.Types.ObjectId,
            ref: 'categories',
        },
        brand: {
            type: Schema.Types.ObjectId,
            ref: 'brands',
        },
        model: {
            type: Schema.Types.ObjectId,
            ref: 'models',
        },
        image: {
            type: Schema.Types.ObjectId,
            ref: 'uploads',
        },
        price: Number,
        discount: Number,
        discountedPrice: Number,
        title: {
            type: String,
            intl: true
        },
        description: {
            type: String,
            intl: true
        },
        top: Boolean,
        characteristicGroups: {
            type: Schema.Types.Mixed
        },
        slug: {
            type: String,
            required: true,
            intl: true,
        },
        alternatives: Schema.Types.Mixed,
    }, {
        timestamps: true,
        versionKey: false,
        id: false,
        toJSON: {
            virtuals: true
        }
    });

    schema.pre('find', function (next) {
        this.populate([
            {
                path: "category",
                model: "categories",
                select: 'name'
            },
            {
                path: "brand",
                model: "brands",
                select: 'name -logo -_id'
            },
            {
                path: "model",
                model: "models",
                select: 'name -brand -_id'
            },
            {
                path: "image",
                model: "uploads",
                select: 'src -_id'
            },
            {
                path: 'characteristicGroups',
                populate: [
                    {
                        path: 'group',
                        model: 'characteristic_groups',
                        select: 'name visible -_id'
                    },
                    {
                        path: 'characteristics',
                        populate: [
                            {
                                path: 'item',
                                model: 'characteristics',
                                select: 'name component.name component.attrs.suffix component.attrs.showOnItem -_id',
                            }
                        ],
                    }
                ]
            },
        ]);

        next();
    });

    /*schema.pre('findOne', function (next) {

        if(this._conditions['slug.az'] || this._conditions['slug.en'] || this._conditions['slug.ru']){
            this.populate([
                {
                    path: "category",
                    model: "categories",
                    select: 'name -_id'
                },
                {
                    path: "brand",
                    model: "brands",
                    select: 'name -logo -_id'
                },
                {
                    path: "model",
                    model: "models",
                    select: 'name -brand -_id'
                },
                {
                    path: "image",
                    model: "uploads",
                    select: 'src -_id'
                },
                {
                    path: 'characteristicGroups',
                    populate: [
                        {
                            path: 'group',
                            model: 'characteristic_groups',
                            select: 'name -_id'
                        },
                        {
                            path: 'characteristics',
                            populate: [
                                {
                                    path: 'item',
                                    model: 'characteristics',
                                    select: 'name component.attrs.suffix component.attrs.showOnItem -_id',
                                },
                            ],
                        }
                    ]
                },
            ])
        }

        next();
    });*/

    // This is necessary to avoid model compilation errors in watch mode
    // see https://mongoosejs.com/docs/api/connection.html#connection_Connection-deleteModel
    if (mongooseClient.modelNames().includes(modelName)) {
        mongooseClient.deleteModel(modelName);
    }
    return mongooseClient.model(modelName, schema);

};
