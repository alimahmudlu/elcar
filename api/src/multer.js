const mongoose = require('mongoose');
const multer = require('multer');
const slugify = require('slugify');
slugify.extend({' ': '-'});
slugify.extend({'ə': 'e'});
slugify.extend({'ö': 'o'});
slugify.extend({'ş': 's'});
slugify.extend({'ü': 'u'});

const getFileName = (fileName, regex = /^(.+)\..+$/)=> {
    const match = fileName.match(regex);
    return match ? match[1] : null;
};

const getFileExtension = (fileName)=> {
    const match = fileName.match(/\..+$/);
    return match ? match[0].substring(1) : null;
};

const checkExistFiles = async (checkedName)=> {

    const existFiles = await mongoose.model('uploads').find({name: checkedName});

    if(existFiles.length){

        let newName, match = checkedName.match(/^(.+)__(\d+)$/);

        if(match){
            const {[1]: name, [2]: number} = match;
            newName = `${name}__${+number + 1}`;
        }else{
            newName = `${checkedName}__1`;
        }

        return await checkExistFiles(newName);

    }else{
        return checkedName;
    }
};

const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        const isImage = /(jpg|jpeg|png|gif|bmp|webp|tif|tiff)$/i.test(file.mimetype);
        return cb(null, `public/uploads/${isImage ? 'temp' : 'files'}`);
    },
    filename: (req, file, cb) => {
        return cb(null, `${file.originalname}.${file.extension}`);
    }
});

const upload = multer({
    storage,
    limits: {
        fieldSize: 1e+8,
        fileSize: 1e+7
    },
    fileFilter: async (req, file, callback) => {

        if (!file) callback(null, false);

        let extension = getFileExtension(file.originalname);

        if(file.originalname === 'blob') extension = file.mimetype.split('/')[1];
        extension = extension.toLowerCase();
        extension = extension.replace(/jpeg/i, 'jpg');

        if (!(/\.(jpg|jpeg|png|gif|bmp|webp|tif|tiff|svg|doc|docx|odt|ods|pdf|xls|xlsx|ppt|pptx|txt)$/i.test(`.${extension}`))) {
            return callback(`Wrong file type "${file.mimetype}"`, false);
        }

        if(/(jpg|jpeg|png|gif|bmp|webp)$/i.test(file.mimetype)){
            file.extension = 'webp'
        }else{
            file.extension = extension
        }

        file.originalname = await slugify(getFileName(file.originalname), {replacement: '-', lower: true});
        file.originalname = await checkExistFiles(file.originalname);

        callback(null, true);

    },
});

exports.upload = upload;
