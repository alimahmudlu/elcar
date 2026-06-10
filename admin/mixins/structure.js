import allPages from '../structure/pages';

export const structureMixins = {

    data: () => ({
        slugModel: {},
        hasParent: false
    }),

    async fetch() {
        await this.setActivePage();
    },

    computed: {
        activePage() {
            return this.$store.state.activePage;
        },
    },

    methods: {

        async setActivePage() {

            /* FIND ACTIVE PAGE */
            const activePage = allPages.find(page => page.config.route.path === this.$routeName())

            /* IF PAGE NOT FOUND */
            if (!activePage) {
                this.$nuxt.error({statusCode: 404, statusText: 'Page not found'});
                return;
            }

            if(!activePage.config.route.parent){
                this.$storage.setCookie('active-section', activePage._id)
            }

            let sectionId = this.$storage.getCookie('active-section')
            const activeSection = this.$navMenuById(sectionId)

            if(activeSection){
                this.$setState({key: 'activeSection', data: activeSection})
            }

            /* SET ACTIVE PAGE */
            this.$setState({key: 'activePage', data: activePage})

            /* SET ROUTE LANGUAGES */
            // await this.$store.dispatch('i18n/setRouteParams', this.slugModel);

        },
    }

};
