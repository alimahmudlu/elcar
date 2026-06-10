export default ({app, route, error: nuxtError}) => {
    const { module, section, action } = route.meta[0]

    const isGeneral = module === 'general'
    const hasModuleAccess = app.router.app.$can('read', module)
    const hasSectionAccess = app.router.app.$can(action, `${module}-${section}`)

    if(hasModuleAccess && !section || hasModuleAccess && hasSectionAccess || isGeneral){
        //
    }else{
        nuxtError({
            statusCode: 404,
            message: "Page Not Found",
        });
        return Promise.resolve(false);
    }
}
