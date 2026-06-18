require('dotenv').config();
const fs = require('fs');

const AWS = require('aws-sdk');

const Bucket = process.env.AWS_BUCKET_NAME;
const accessKeyId = process.env.AWS_ACCESS_KEY;
const secretAccessKey = process.env.AWS_SECRET_KEY;
const endpoint = process.env.STORAGE_BASE_URL;

const s3 = new AWS.S3({
    endpoint,
    accessKeyId,
    secretAccessKey,
    // s3BucketEndpoint: true,
    // s3ForcePathStyle: true,
    s3ForcePathStyle: true,
    signatureVersion: 'v4'
});

/*====================================================================================================================*/
/* Upload file to AWS S3 Bucket */
/*====================================================================================================================*/

const uploadFile = async function (path, s3Key) {

    const fileStream = fs.createReadStream(path);

    fileStream.on('error', (error) => {
        console.error(`Error reading file ${path}: ${error}`);
    });

    try {
        return await s3.putObject({
            Bucket,
            Body: fileStream,
            Key: s3Key,
            ACL: 'public-read'
        }, (error, data) => {
            console.log(data, error, 'ci');
            if (error) return error;
            return data;
        });

    } catch (error) {
        console.log(error);
        return error;
    }
};

exports.uploadFile = uploadFile;

/*====================================================================================================================*/
/* Rename file in AWS S3 Bucket */
/*====================================================================================================================*/

const renameFile = async function (oldKey, newKey) {

    const CopySource = `${Bucket}/${oldKey}`;

    try {
        return await s3.copyObject({
            Bucket,
            CopySource,
            Key: newKey
        }).promise()
            .then(() => s3.deleteObject({
                Bucket,
                Key: oldKey
            }).promise())
            .catch((error) => error);

    } catch (error) {
        return error;
    }
};

exports.renameFile = renameFile;

/*====================================================================================================================*/
/* Delete file from AWS S3 & CloudFront */
/*====================================================================================================================*/

const deleteFile = async function (src) {

    const Key = src.replace('uploads/files', '');

    s3.deleteObject({Bucket, Key}, function (error, data) {
        if (error) {
            console.log('error', error);
        } else {
            console.log('data', data);
        }
    });

};

exports.deleteFile = deleteFile;

/*====================================================================================================================*/
/* Get file url from AWS CloudFront */
/*====================================================================================================================*/

const getFile = function (req, res) {

    try {

        const {key} = req.params;

        s3.getObject({Bucket, Key: key}, function (error, data) {

            if (data && data.Body) {
                res.writeHead(200, {'Content-Type': data.ContentType});
                res.write(data.Body, 'binary');
                res.end(null, 'binary');
            } else {
                res.status(404);
            }

        });

    }catch (e) {
        throw new Error(`Could not retrieve file from S3: ${e.message}`)
    }
};

exports.getFile = getFile;
