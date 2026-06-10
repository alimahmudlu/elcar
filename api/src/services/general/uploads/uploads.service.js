const {Uploads} = require('./uploads.class');
const createModel = require('../../../models/general/uploads.model');
const hooks = require('./uploads.hooks');
const uploadFiles = require('../../../middleware/upload-files');
const {upload} = require('../../../multer');
const {getFile} = require('../../../s3');

module.exports = function (app) {

    const options = {
        Model: createModel(app),
        paginate: app.get('paginate'),
        whitelist: ['$in']
    };

    app.use('/uploads', upload.array('files'), uploadFiles(), new Uploads(options, app));

    app.use('/uploads/files/:key', (req, res) => getFile(req, res));
    app.use('/site/uploads/files/:key', (req, res) => getFile(req, res));

    const service = app.service('uploads');

    service.hooks(hooks);

};
