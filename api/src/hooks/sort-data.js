// Use this hook to manipulate incoming or outgoing data.
// For more information on hooks see: http://docs.feathersjs.com/api/hooks.html

// eslint-disable-next-line no-unused-vars
module.exports = (sort = {_id: -1}) => {
    return context => {

        const actions = {
            find: 'read',
            get: 'read',
            findOne: 'read',
            findById: 'read'
        };

        if (actions[context.method] === 'read' && context.method !== 'get' && !context.params.query.$sort) {
            context.params.query.$sort = sort
        }

        return context
    }
};
