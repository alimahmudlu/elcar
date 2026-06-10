module.exports = (key) => {
    return context => {

        const { query, user } = context.params;

        if(!['root', 'owner'].includes(user.currentAccess.role.key)){
            query[key] = user.teams
        }

        context.params.query = query

        return context
    }
};
