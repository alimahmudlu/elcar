module.exports = (options = {lean: false}) => {
    return async context => {
        context.service.lean = options.lean
        return context
    }
};
