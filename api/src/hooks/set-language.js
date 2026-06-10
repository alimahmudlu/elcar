const mongoose = require('mongoose');

// eslint-disable-next-line no-unused-vars
module.exports = (options = {}) => {
    return async context => {

        const lang = context.params.headers['content-language']

        mongoose.setDefaultLanguage(lang)

        if(context.result.data && Array.isArray(context.result.data)){

            context.result.data.forEach(item => item.setLanguage(lang))

        }else{

            if(Array.isArray(context.result)){
                context.result.forEach(item => item.setLanguage(lang))
            }else{
                context.result.setLanguage(lang)
            }
        }

        return context
    }
};
