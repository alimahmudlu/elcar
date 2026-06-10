export default function({ $auth, app }) {
    $auth.onRedirect((to, from) => {

        if (to || to === 'login') {
            return app.localePath({name: 'auth-sign-in'}, app.locale)
        }

        return to;
    })
}
