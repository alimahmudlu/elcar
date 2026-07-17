require('dotenv').config()
const { exec  } = require('child_process')
const cron = require('node-cron');
const fs = require('fs');
const path = require('path');
const os = require('os');

module.exports = function (app) {

    const DB_NAME = process.env.DB_NAME
    const OUT_PATH = 'backup/'

    cron.schedule('0 0 * * *', () => backupMongoDB());
    cron.schedule('38 13 * * *', () => cleanTempFiles());
    cron.schedule('40 09 * * *', () => cleanTempFiles());

    function cleanTempFiles() {
        const tempDir = os.tmpdir();
        const now = Date.now();
        const maxAge = 24 * 60 * 60 * 1000; // 24 hours
        console.log('running CRON JOB CLEAR TMP');

        // Clean root temp directory
        cleanDir(tempDir);

        // Clean /tmp/dashboard if it exists and is a directory
        const dashboardDir = '/tmp/dashboard';
        try {
            if (fs.existsSync(dashboardDir)) {
                const stats = fs.statSync(dashboardDir);
                if (stats.isDirectory()) {
                    cleanDir(dashboardDir);
                } else if ((now - stats.mtimeMs) > maxAge) {
                    // If it's a file instead of a directory, delete it if old
                    fs.unlink(dashboardDir, (err) => {
                        if (err) console.error(`Error deleting old /tmp/dashboard file:`, err);
                        else console.log(`Deleted old /tmp/dashboard file`);
                    });
                }
            }
        } catch (e) {
            console.error('Error checking /tmp/dashboard:', e);
        }

        function cleanDir(dirPath) {
            fs.readdir(dirPath, (err, files) => {
                if (err) {
                    console.error(`Error reading directory ${dirPath}:`, err);
                    return;
                }

                files.forEach(file => {
                    const filePath = path.join(dirPath, file);
                    fs.stat(filePath, (err, stats) => {
                        if (err) return;

                        // Delete files that start with 'multer-' or are in dashboard and are old
                        const isMulter = file.startsWith('multer-');
                        const isDashboardFile = dirPath === dashboardDir;

                        if ((isMulter || isDashboardFile) && (now - stats.mtimeMs) > maxAge) {
                            if (stats.isDirectory()) {
                                fs.rm(filePath, { recursive: true, force: true }, (err) => {
                                    if (err) console.error(`Error deleting temp dir ${file}:`, err);
                                    else console.log(`Deleted old temp dir: ${file}`);
                                });
                            } else {
                                fs.unlink(filePath, (err) => {
                                    if (err) console.error(`Error deleting temp file ${file}:`, err);
                                    else console.log(`Deleted old temp file: ${file}`);
                                });
                            }
                        }
                    });
                });
            });
        }
    }

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

// Allow manual execution from command line
if (require.main === module) {
    console.log('Running manual cleanup...');
    const os = require('os');
    const fs = require('fs');
    const path = require('path');

    function cleanDir(dirPath, dashboardDir, now, maxAge) {
        fs.readdir(dirPath, (err, files) => {
            if (err) {
                console.error(`Error reading directory ${dirPath}:`, err);
                return;
            }

            files.forEach(file => {
                const filePath = path.join(dirPath, file);
                fs.stat(filePath, (err, stats) => {
                    if (err) return;

                    const isMulter = file.startsWith('multer-');
                    const isDashboardFile = dirPath === dashboardDir;

                    if ((isMulter || isDashboardFile) && (now - stats.mtimeMs) > maxAge) {
                        if (stats.isDirectory()) {
                            fs.rm(filePath, { recursive: true, force: true }, (err) => {
                                if (err) console.error(`Error deleting temp dir ${file}:`, err);
                                else console.log(`Deleted old temp dir: ${file}`);
                            });
                        } else {
                            fs.unlink(filePath, (err) => {
                                if (err) console.error(`Error deleting temp file ${file}:`, err);
                                else console.log(`Deleted old temp file: ${file}`);
                            });
                        }
                    }
                });
            });
        });
    }

    const tempDir = os.tmpdir();
    const dashboardDir = '/tmp/dashboard';
    const now = Date.now();
    const maxAge = 24 * 60 * 60 * 1000;

    cleanDir(tempDir, dashboardDir, now, maxAge);

    try {
        if (fs.existsSync(dashboardDir)) {
            const stats = fs.statSync(dashboardDir);
            if (stats.isDirectory()) {
                cleanDir(dashboardDir, dashboardDir, now, maxAge);
            } else if ((now - stats.mtimeMs) > maxAge) {
                fs.unlink(dashboardDir, (err) => {
                    if (err) console.error(`Error deleting /tmp/dashboard file:`, err);
                    else console.log(`Deleted /tmp/dashboard file`);
                });
            }
        }
    } catch (e) {
        console.error('Error checking /tmp/dashboard manually:', e);
    }
}

// mongodump --db=DB_NAME --archive=./DB_NAME.gzip --gzip
// mongorestore --db=db_name --collection=collection_name backup/collection_name.bson
