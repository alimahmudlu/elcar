export default function ({app, error: nuxtError}) {

    app.$axios.defaults.headers.common['Content-Language'] = app.i18n.locale;
    app.$axios.defaults.headers.common['Accept-Language'] = app.i18n.locale;

    if (app.$auth.user?.currentAccess?.workspace) {
        app.$axios.defaults.headers.common['wrs'] = app.$auth.user.currentAccess.workspace._id
    }

    app.$axios.onError(error => {
        if(error.response.status === 404 || error.response.status === 500){
            if(process.client){
                app.$responseError(error.response)
            }else{
                nuxtError({
                    statusCode: error.response.status,
                    message: error.response.statusText,
                });
                return Promise.resolve(false);
            }
        }
    })
}
