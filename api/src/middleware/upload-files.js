const fs = require('fs');
const path = require('path');
const sharp = require('sharp');
const { uploadFile } = require('../s3');
sharp.cache(false);

const rootDir = path.join(__dirname, '../../public/uploads/');

module.exports = () => {
    return async function uploadFiles(req, res, next) {

        const { method, query } = req;

        try {
            if ((!req.files || !req.files.length) && method !== 'POST') return next();

            const formData = [];
            req.feathers.files = req.files;
            const tempPath = `${rootDir}temp/`;
            const filesPath = `${rootDir}files/`;

            for (const file of req.files) {
                file.extension = file.originalname.split('.').pop().toLowerCase();
                const { filename, mimetype } = file;

                const isSvg = /(svg(\+xml))$/i.test(mimetype);
                const isImage = /(jpg|jpeg|png|gif|svg|bmp|webp|tif|tiff)$/i.test(mimetype);
                const isDocument = /(doc|docx|odt|ods|pdf|xls|xlsx|ppt|pptx|txt)$/i.test(mimetype);

                const src = `uploads/files/${file.originalname}.${file.extension}`;
                const name = file.originalname;
                const type = (isSvg || isImage) ? 'image' : isDocument ? 'document' : 'file';

                const fileModel = {
                    src,
                    name,
                    type,
                    alt: name,
                    size: file?.size,
                    width: 0,
                    height: 0,
                    extension: file.extension,
                    folder: query.folder,
                    modules: query.modules
                };

                const newPath = path.resolve(filesPath, filename);

                if (isImage) {
                    const sharpImage = sharp(file.path);
                    const metadata = await sharpImage.metadata();

                    const options = {
                        fit: 'inside',
                        width: metadata.width,
                        height: metadata.height,
                    };

                    const maxWidth = parseInt(query.maxWidth || 1200);
                    const maxHeight = parseInt(query.maxHeight || 1200);

                    if (metadata.width > maxWidth) {
                        options.width = maxWidth;
                    }

                    if (metadata.height > maxHeight) {
                        options.height = maxHeight;
                    }

                    const formatMap = {
                        jpg: 'jpeg',
                        jpeg: 'jpeg',
                        png: 'png',
                        webp: 'webp',
                        tiff: 'tiff'
                    };

                    const sharpFormat = formatMap[file.extension];

                    await new Promise((resolve, reject) => {
                        let pipeline = sharpImage.resize(options);

                        if (sharpFormat && typeof pipeline[sharpFormat] === 'function') {
                            pipeline = pipeline[sharpFormat]({ quality: 100 });
                        }

                        pipeline.toFile(newPath, (error, data) => {
                            if (error) {
                                console.error(error);
                                reject(error);
                            } else {
                                fileModel.width = data.width;
                                fileModel.height = data.height;
                                fileModel.size = data.size;

                                const oldPath = path.resolve(tempPath, filename);
                                if (fs.existsSync(oldPath)) {
                                    fs.unlinkSync(oldPath);
                                }

                                resolve(true);
                            }
                        });
                    });
                }

                const s3Key = `${file.originalname}.${file.extension}`;
                await uploadFile(newPath, s3Key);

                setTimeout(() => {
                    if (fs.existsSync(newPath)) {
                        fs.unlinkSync(newPath);
                    }
                }, 5000);

                formData.push(fileModel);
            }

            req.body = { ...req.body, formData };
            next();

        } catch (error) {
            console.error('[upload-files.js] Error:', error);
            next(error);
        }
    };
};
