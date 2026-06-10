// users-model.js - A mongoose model
//
// See http://mongoosejs.com/docs/models.html
// for more of what you can do here.

module.exports = function (app) {
    const modelName = 'users';
    const mongooseClient = app.get('mongooseClient');
    const {Schema} = mongooseClient;
    const schema = new Schema({
        name: {
            type: String,
            required: true,
            minlength: [3, 'Minimum 3 character required'],
            match: [/^[a-zA-Z]+$/, 'Name is invalid']
        },
        surname: {
            type: String,
            required: true,
            minlength: [3, 'Minimum 3 character required'],
            match: [/^[a-zA-Z]+$/, 'Surname is invalid']
        },
        email: {
            type: String,
            unique: true,
            lowercase: true,
            required: true,
            trim: true,
            validate: {
                validator: function(v) {
                    return /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/.test(v);
                },
                message: "Please enter a valid email"
            },
        },
        password: {
            type: String
        },
        photo: {
            type: Schema.Types.ObjectId,
            ref: 'uploads',
            default: null
        },
        phone: String,
        gender: String,
        teams: {
            type: [Schema.Types.ObjectId],
            ref: 'teams',
            default: [],
        },
        accessList: {
            type: [Schema.Types.ObjectId],
            ref: 'user_access',
            default: [],
        },
        currentAccess: {
            type: Schema.Types.ObjectId,
            ref: 'user_access',
            default: null
        },
        defaultAccess: {
            type: Schema.Types.ObjectId,
            ref: 'user_access',
            default: null
        },
        // googleId: {type: String},
        // facebookId: {type: String},
    }, {
        timestamps: true,
        versionKey: false,
        id: false,
    });

    schema.pre('find', function (next) {
        this.populate([
            {
                path: 'photo',
                select: "src",
            },
            {
                path: 'teams',
                select: "name",
            },
            {
                path: 'currentAccess',
                select: "-_id -createdAt -updatedAt -user",
                populate:[
                    {
                        path: 'role',
                        select: "-_id key name"
                    },
                    {
                        path: 'workspace',
                        select: "name"
                    },
                    {
                        path: 'permissions',
                        select: "module"
                    }
                ],
            },
        ]).select('-defaultAccess -accessList');

        next();
    });

    schema.pre('findOne', function (next) {
        this.select('-createdAt -updatedAt').populate([
            {
                path: 'photo',
            },
            {
                path: 'accessList',
                select: "workspace role",
                populate:[
                    {
                        path: 'role',
                        select: "-_id key name"
                    },
                    {
                        path: 'workspace',
                        select: "name createdBy",
                        populate: [
                            {
                                path: 'createdBy',
                                select: "name surname"
                            },
                        ]
                    }
                ],
            },
            {
                path: 'currentAccess',
                select: "-_id -createdAt -updatedAt",
                populate:[
                    {
                        path: 'role',
                        select: "-_id key name"
                    },
                    {
                        path: 'workspace',
                        select: "name createdBy",
                        populate: [
                            {
                                path: 'createdBy',
                                select: "-_id name surname"
                            },
                        ]
                    },
                    {
                        path: 'permissions',
                        select: "-_id sections module",
                        populate: [
                            {
                                path: 'module',
                                select: "name key"
                            },
                        ]
                    }
                ],
            },
        ]);

        next();
    });

    // This is necessary to avoid model compilation errors in watch mode
    // see https://mongoosejs.com/docs/api/connection.html#connection_Connection-deleteModel
    if (mongooseClient.modelNames().includes(modelName)) {
        mongooseClient.deleteModel(modelName);
    }
    return mongooseClient.model(modelName, schema);

};
