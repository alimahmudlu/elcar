// eslint-disable-next-line no-unused-vars
const aqp = require('api-query-params')
module.exports = (options = {}) => {
    return context => {

        context.params.query = aqp(context.params.query, {
            blacklist: ['apiKey', 'token', 'accessToken'],
            casters: {
                // lowercase: val => val.toLowerCase(),
                // int: val => parseInt(val, 10),
                boolean: val => (val === 'true' ? '1' : '0'),
            },
        });

        context.params.query = {
            ...context.params.query,
            ...context.params.query.filter,
        };

        let {$limit, noPagination} = context.params.query;

        if (noPagination) {
            context.params.paginate = false;
        }

        if ((noPagination && !$limit) || $limit === 'all') {
            context.params.query.$limit = 10000000;
        }

        delete context.params.query.filter;
        delete context.params.query.noPagination;

        return context;
    };
};
