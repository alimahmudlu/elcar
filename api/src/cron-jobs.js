require('dotenv').config()
const { exec  } = require('child_process')
const cron = require('node-cron');
// const fs = require('fs');
// const path = require('path');
// const { uploadFile } = require('./s3')

module.exports = function (app) {

    const DB_NAME = process.env.DB_NAME
    const OUT_PATH = 'backup/'

    cron.schedule('0 0 * * *', () => backupMongoDB());
    // cron.schedule('*/15 * * * * *', () => backupMongoDB());

    async function backupMongoDB() {
        await exec(`mongodump --uri=mongodb://localhost:27017/${DB_NAME} --out=./${OUT_PATH}`, (error, stdout, stderr) => {
            if (error) {
                console.error(`exec error: ${error}`);
                return;
            }
            console.log(`stdout: ${stdout}`);
            console.error(`stderr: ${stderr}`);
        });

        // const folderPath = `./backup/${DB_NAME}`
        //
        // await fs.readdir(folderPath, async (err, files) => {
        //
        //     if (err) {
        //         console.error(err);
        //         return;
        //     }
        //
        //     await files.forEach(file => {
        //         const filePath = path.join(folderPath, file);
        //         uploadFile(filePath, file)
        //     });
        // });
    }
};

// mongodump --db=DB_NAME --archive=./DB_NAME.gzip --gzip
// mongorestore --db=db_name --collection=collection_name backup/collection_name.bson
