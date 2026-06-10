// Use this hook to manipulate incoming or outgoing data.
// For more information on hooks see: http://docs.feathersjs.com/api/hooks.html

// eslint-disable-next-line no-unused-vars
module.exports = (options = {}) => {
    return context => {

        const {data, total, skip, limit} = context.result;
        const {noPagination} = context.params.query

        if (!noPagination && (total || limit || skip)) {
            context.result = {
                data,
                meta: {
                    total,
                    limit,
                    skip,
                    // page: (skip / limit) + 1,
                    // lastPage: Math.ceil(total/limit)
                }
            };
        }

        if(noPagination){
            context.result = data
        }

        return context;

    };
};
