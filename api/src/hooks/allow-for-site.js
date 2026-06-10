// Use this hook to manipulate incoming or outgoing data.
// For more information on hooks see: http://docs.feathersjs.com/api/hooks.html

// eslint-disable-next-line no-unused-vars
module.exports = (options = {methods: ['find', 'get']}) => {
    return context => context.path.startsWith('site/') && options.methods.includes(context.method)
};


