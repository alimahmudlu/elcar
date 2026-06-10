const mongoose = require('mongoose');
const logger = require('./logger');
const mongooseIntl = require('mongoose-intl');

module.exports = function (app) {

    const languages = ['az', 'en', 'ru']
    mongoose.connect(app.get('mongodb')).catch(err => {
        logger.error(err);
        process.exit(1);
    });

    // mongoose.set('strictQuery', false);
    mongoose.plugin(mongooseIntl, {languages, defaultLanguage: languages[0]});

    app.set('mongooseClient', mongoose);
};
