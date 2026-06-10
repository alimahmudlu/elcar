const slugify = require('slugify');
slugify.extend({'.': '-'});
slugify.extend({':': '-'});
slugify.extend({'(': '-'});
slugify.extend({')': '-'});

// eslint-disable-next-line no-unused-vars
module.exports = ({title = 'title', target = 'slug', alternatives = true, locale = null} = {}) => {
    return async context => {

        const evalKey = `context.data.${title}`

        let contentTitle = eval(evalKey),
            slugOptions = {replacement: '-', lower: true};

        if (contentTitle) {
            if (typeof contentTitle === 'object') {

                if(!locale){

                    context.data[target] = {};
                    await Object.keys(contentTitle).forEach(key => context.data[target][key] = slugify(contentTitle[key], slugOptions));
                    if(alternatives) context.data.alternatives = context.data[target];

                }else{
                    context.data[target] = slugify(contentTitle[locale], slugOptions);
                }

            } else {
                context.data[target] = slugify(contentTitle, slugOptions);
            }
        }

        return context;
    };
};
