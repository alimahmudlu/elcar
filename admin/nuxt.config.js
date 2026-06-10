const {NODE_ENV} = process.env;
const isDev = NODE_ENV === "development";

import i18n from './plugins/i18n';
import pwa from './plugins/pwa';
import vuetify from './plugins/vuetify';

export default {

    head: {},

    server: {
        port: 3112,
        host: 'localhost',
        timing: false,
    },

    loading: {
        color: '#009f06',
        failedColor: 'red',
        height: '3px'
    },

    css: [],

    plugins: [
        {src: '@/plugins/global-functions'},
        {src: '@/plugins/vue-chart', mode: 'client'},
        {src: '@/plugins/casl'},
    ],

    components: {
        dirs: [
            {path: '@/components/app/', prefix: 'app'},
            {path: '@/components/apps/'},
            {path: '@/components/general/'},
            {path: '@/components/common/'},
            {path: '@/components/common/buttons'},
            {path: '@/components/common/form'},
            {path: '@/components/structure/'},
        ]
    },

    buildModules: [
        '@nuxtjs/vuetify',
    ],

    modules: [
        '@nuxtjs/axios',
        '@nuxtjs/auth',
        '@nuxtjs/pwa',
        '@nuxtjs/universal-storage',
        '@nuxtjs/i18n',
        '@nuxtjs/dayjs',
        '@nuxt/image',
        'nuxt-webfontloader',
    ],

    // serverMiddleware: ['~/api/index.js'],

    axios: {
        https: false,
        baseURL: isDev ? process.env.DEV_API_URL : process.env.API_URL,
        retry: {retries: 3},
        headers: {
            "content-type": "application/json",
            "accept": "application/json",
            "Access-Control-Allow-Origin": "*"
        }
    },

    publicRuntimeConfig: {
        axios: {
            browserBaseURL: isDev ? process.env.DEV_API_URL : process.env.API_URL,
        },

        apiUrl: isDev ? process.env.DEV_API_URL : process.env.API_URL,
    },

    privateRuntimeConfig: {
        axios: {
            baseURL: isDev ? process.env.DEV_API_URL : process.env.API_URL,
        }
    },

    router: {
        middleware: ['index'],
        scrollBehavior(to, from, savedPosition) {
            return savedPosition;
        }
    },

    i18n,
    pwa,
    vuetify,

    auth: {
        strategies: {
            local: {
                endpoints: {
                    login: {
                        url: 'auth/login',
                        method: 'post',
                        propertyName: 'accessToken',
                    },
                    user: {
                        url: 'auth/user',
                        method: 'get',
                        propertyName: false,
                    },
                },
            },
        },
        plugins: [
            {src: '@/plugins/auth'},
            {src: '@/plugins/axios'},
        ],
        redirect: {
            login: '/login',
            logout: '/login',
            callback: '/login',
            home: '/',
        },
    },

    dayjs: {
        locales: i18n.locales.map(locale => locale.code),
        defaultLocale: i18n.locale,
        plugins: ['relativeTime'],
    },

    webfontloader: {
        google: {
            families: [
                'Roboto:ital,wght@0,100;0,300;0,400;0,500;0,700;0,900&display=swap&subset=latin-ext',
            ],
        },
    },

    build: {

        extend(config, {isDev, isClient}) {
            if (isDev) {
                config.devtool = (isDev ? 'eval-source-map' : false);
            }

            config.node= {
                fs: 'empty'
            }

            // config.resolve.alias["vue$"] = "vue/dist/vue.esm.js"
        }

    }
};
