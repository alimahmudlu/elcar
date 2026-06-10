import Vue from 'vue';
import { helpers } from 'vuelidate/lib/validators';
import allPages from '../structure/pages';

global.structuredClone = (val) => JSON.parse(JSON.stringify(val));

String.prototype.clearHtml = function () {
    return this.replace(/<\/?[^>]+(>|$)/g, '');
};

String.prototype.toHtml = function (htmlTag) {
    return `<${ htmlTag }>${ this }</${ htmlTag }>`;
};

String.prototype.toCapitalize = function () {
    if (!this && typeof this !== 'string') return '';
    return this.charAt(0).toUpperCase() + this.slice(1);
};

String.prototype.toCamelCase = function () {
    return this.replace(/(?:^\w|[A-Z]|\b\w)/g, function (word, index) {
        return index === 0 ? word.toLowerCase() : word.toUpperCase();
    }).replace(/[_-]|\s+/g, '');
};

Array.prototype.insert = function (index, item) {
    this.splice(index, 0, item);
};

Vue.prototype.$setAbility = function () {

    const rules = [], user = this.$auth.user;

    switch (user.currentAccess.role.key) {
        case 'root':
            rules.push({ action: 'manage', subject: 'all' });
            break;

        case 'owner':
            rules.push({
                action: 'manage',
                subject: 'all',
                field: { workspace: this.$auth.user.currentAccess.workspace._id }
            });
            break;
    }

    this.$auth.user.currentAccess.permissions.forEach(permission => {
        const moduleKey = permission.module.key;

        rules.push({ action: 'read', subject: moduleKey });

        permission.sections.forEach(section => {
            section.actions.forEach(action => {
                if (action.default) {
                    rules.push({
                        action: action.key,
                        subject: `${ moduleKey }-${ section.key }`
                    });
                }
            });
        });
    });

    this.$ability.update(rules);
};

Vue.prototype.$isRoot = function () {
    return this.$auth.user.currentAccess.role.key === 'root';
};

Vue.prototype.$localePath = function (routeOpt, locale = this.$i18n.locale) {
    return this.localePath(routeOpt, locale);
};

Vue.prototype.$formatter = function (value, opt = { locale: this.$i18n.locale, mfd: 0 }) {

    const formatter = new Intl.NumberFormat(opt.locale, {
        minimumFractionDigits: opt.mfd
    });

    return formatter.format(value);
};

Vue.prototype.$routeName = function () {
    return this.$route.name?.split('___')[0];
};

Vue.prototype.$routeIs = function (route) {
    return this.$routeName() === route;
};

Vue.prototype.$navMenuById = function (menuId, getModule = false) {

    const menu = allPages.find(page => page._id === menuId);

    if (menu) {

        const { _id, config, header } = menu;
        const { module, route } = config;

        const menuModel = {
            _id,
            name: this.$byLocale(menu.name),
            menu: header.menu,
            group: route.group,
            path: route.path,
            module
        };

        module && getModule && appModuleDetails(this.$store, menuModel, module.name);

        return menuModel;
    }
};

Vue.prototype.$navMenusByParent = function (options = {}) {

    const _id = options._id || null, group = options.group || [ 'general' ], position = options.position || [ 'top' ];

    return allPages.filter(page => page.header.menu.display
        && (page.config.route.parent ? page.config.route.parent?._id === _id : page.config.route.parent === _id)
        && group.includes(page.config.route.group) && position.includes(page.header.menu.position)
        && (page.config.module.name === 'general' || this.$can('read', page.config.module.name))
    ).map(page => {

        const module = page.config.module;

        const menuModel = {
            _id: page._id,
            name: this.$byLocale(page.name),
            menu: page.header.menu,
            route: page.config.route,
            module
        };

        module && options.getModule && appModuleDetails(this.$store, menuModel, module.name);

        return menuModel;
    });
};

const appModuleDetails = ($store, menuModel, moduleName) => {

    const module = $store.state.appModules?.find(module => module.key === moduleName);

    if (module) {
        menuModel.name = module.name;
        menuModel.description = module.description;
        menuModel.menu.icon = module.icon;
        menuModel.menu.color = module.color;
        menuModel.menu.image = module.image;
    }
};

Vue.prototype.$appModule = function (key) {
    const activeAppKey = key || this.$store.state.activeSection.module.name;
    return this.$store.state.appModules.find(app => app.key === activeAppKey);
};

Vue.prototype.$arrayToObject = function (array) {
    return array && array.length > 0 ? array.reduce((obj, item) => {
        return Object.assign(obj, { [item.key]: item.value });
    }, {}) : {};
};

Vue.prototype.$fetchPending = function () {
    return this.$store.state.fetchLoading;
};

Vue.prototype.$reFetch = function (key = 'reFetchData') {
    this.$setState({ key, data: true });
    setTimeout(() => this.$setState({ key, data: false }));
};

Vue.prototype.$replacePath = function (routeOpt) {
    return this.$router.replace(routeOpt).catch(() => {
    });
};

Vue.prototype.$pushQuery = async function (query, val) {
    if (this.$route.query[query] && (val === '' || val === null || Array.isArray(val) && val.length === 0)) {
        await this.$deleteQuery(query);
    } else {
        await this.$router.push({ query: { ...this.$route.query, [query]: val } });
    }
};

Vue.prototype.$deleteQuery = async function (query) {
    const routeQuery = Object.assign({}, this.$route.query);
    delete routeQuery[query];
    await this.$replacePath({ query: routeQuery });
};

Vue.prototype.$saveData = async function ({
                                              api,
                                              customApi,
                                              method,
                                              query,
                                              payload = {},
                                              validation,
                                              attributes = [],
                                              isFormData = false,
                                              alert = true,
                                              alertMessage,
                                              errorMessage,
                                              callback,
                                              confirms,
                                          }) {

    if (validation) {
        validation && validation.$touch();
        if (validation.$anyError || validation.$invalid) return;
    }

    let payloadData;

    if (isFormData) {

        const formData = new FormData();
        payload.forEach(file => {
            formData.append('files', file, file.name);
        });
        payloadData = formData;

    } else {

        payloadData = structuredClone(payload);
        delete payloadData._id;

    }

    let reqApi = customApi || payload._id ? `${ api }/${ payload._id }` : api;
    let reqMethod = method || payload._id ? 'patch' : 'post';

    try {

        await this.$confirms(confirms);

        const response = await this.$axios[reqMethod](reqApi, payloadData, { params: query });

        if ((payload._id && response.status === 200) || response.status === 201) {

            if (alert) {
                await this.$savedSuccessfully({
                    message: alertMessage ? alertMessage : this.$t('Content saved successfully'),
                    options: {
                        onClose: callback ? () => callback(response.data) : undefined
                    }
                });
            } else {
                if (callback) {
                    return callback(response.data);
                }
            }

        }

    } catch (error) {
        await this.$responseError(error, errorMessage);
        return error;
    }
};

Vue.prototype.$deleteData = async function ({ api, callback, alert = true, alertMessage, errorMessage }) {
    await this.$confirms([
        {
            type: 'warning',
            message: alertMessage || this.$t('Are you sure you want to delete?'),
            allowOnConfirm: true,
            onConfirm: async () => {
                return await new Promise(async (resolve, reject) => {
                    try {

                        const { data } = await this.$axios.delete(api);

                        data && await this.$savedSuccessfully({
                            message: this.$t('Data successfully deleted'),
                            options: {
                                onClose: callback ? () => callback(data) : undefined
                            }
                        });

                        return data && resolve(true);

                    } catch (error) {
                        await this.$responseError(error, errorMessage);
                        reject(error);
                    }
                });
            }
        }
    ]);
};

Vue.prototype.$fetchData = function ({ store, api, query, key, force, push }) {

    const params = {
        store: store || 'index',
        api: api || '',
        query: query || {},
        key: key || api,
        force: force || false,
        push: push || false,
        returnData: !store && !key,
        vm: this
    };

    return new Promise(async (resolve) => {

        let target = store ? this.$store.state[store][params.key] : this.$store.state[params.key];

        if (!target && store) {
            const storeKey = params.store === 'index' ? null : params.store;
            this.$setState({ store: storeKey, key: params.key, data: push ? [] : null });
        }

        if (params.force) {

            const data = await this.$store.dispatch('GET_DATA', params);
            resolve(data);

        } else {
            if (!target || target && (Array.isArray(target) && target.length === 0)) {
                const data = await this.$store.dispatch('GET_DATA', params);
                resolve(data);
            }
        }

    });

};

Vue.prototype.$filterData = function ({ store = '', key = '', arg = '', val = '' }) {
    return this.$store.state[store][key]?.filter(item => eval(arg));
};

Vue.prototype.$setState = function ({ store = '', key = '', data = null }) {
    const stateKey = `${ store ? store + '/' : '' }SET_STATE`;
    this.$store.commit(stateKey, { key, data, vm: this });
};

Vue.prototype.$confirms = async function (list) {
    return await new Promise(async resolve => {

        if (!list || !list.length) return resolve(true);

        await list.map(async (confirm, index) => {

            await new Promise((cResolve, cReject) => {
                this.$openDialog({
                    component: 'common/alert/Wrapper',
                    data: {
                        type: confirm.type || 'warning',
                        title: confirm.title || this.$t('Warning!'),
                        message: confirm.message,
                        confirmBtn: true,
                        onConfirm: async () => {
                            if (typeof confirm.onConfirm !== 'undefined') {
                                await confirm.onConfirm(true);
                            }
                            return cResolve(true);
                        },
                        onClose: async () => {
                            if(confirm.allowOnConfirm){
                                return cReject(true)
                            }else{
                                if (typeof confirm.onClose !== 'undefined') {
                                    await confirm.onClose(true);
                                }
                                return cResolve(true);
                            }
                        }
                    },
                    options: {
                        width: 450,
                        persistent: true,
                        fullSize: false,
                    }
                });
            });

            if (index === 0) {
                return resolve(true);
            }

        });

    });
};

Vue.prototype.$errorMessages = function (field, target = null) {
    let errors = [];
    if (!field.$dirty) return errors;

    Object.entries(field.$params).forEach(([ key, val ]) => {
        if (!field[key]) {
            const secondVal = Object.entries(val)[1];

            if (secondVal && secondVal[1]) {

                if (val.type === 'sameAs') {
                    errors.push(this.$t(`sameAsField`, { n: this.$t(target) }));
                } else if (val.type === 'requiredIf') {
                    errors.push(this.$t(`requiredField`, { n: this.$t(target) }));
                } else {
                    errors.push(this.$t(`${ key }Field`, { n: secondVal[1] }));
                }

            } else {
                errors.push(target ? this.$t(`${ key }Field`, { n: this.$t(target) }) : this.$t(`${ key }Field`));
            }
        }
    });

    return errors;
};

Vue.prototype.$correctPhone = function () {
    const pattern = /\(\D994\s(\b10\b|\b12\b|\b18\b|\b50\b|\b51\b|\b55\b|\b70\b|\b77\b|\b99\b)\)\s[0-9-]{9}$/;
    return helpers.regex('$correctPhone', pattern);
};

Vue.prototype.$savedSuccessfully = function ({ title = null, message = null, options = {} } = {}) {
    this.$openDialog({
        component: 'common/alert/Wrapper',
        data: {
            title: title || this.$t('Success'),
            message: message || this.$t('Saved successfully'),
            ...options
        },
        options: {
            width: 450,
            persistent: true,
            fullSize: false
        }
    });
};

Vue.prototype.$errorOccurred = function ({ title = null, message = null, type = 'alert', icon, options = {} } = {}) {
    if (process.client) {
        this.$openDialog({
            component: 'common/alert/Wrapper',
            data: {
                type: type,
                icon: icon,
                title: title || this.$t('Error'),
                message: message || this.$t('Error occurred'),
                ...options
            },
            options: {
                width: 450,
                persistent: true,
                fullSize: false
            }
        });
    } else {
        console.log(title, message);
    }
};

Vue.prototype.$responseError = function (error, message) {
    this.$errorOccurred({
        type: 'error',
        title: this.$t(error?.response?.statusText),
        message: message ? message(error?.response?.data) : error?.response?.data?.message,
    });
};

Vue.prototype.$openDialog = function (params) {
    this.$store.commit('OPEN_DIALOG', { ...params, vm: this });
};

Vue.prototype.$slideToScroll = function (container, direction, size) {

    const scrolledContainer = document.getElementById(container);

    if (direction === 'right') {

        scrolledContainer.scrollLeft -= size;

        if (scrolledContainer.scrollLeft - size <= 0) {
            scrolledContainer.scrollLeft = 0;
        }

    } else {
        scrolledContainer.scrollLeft += size;

        if (scrolledContainer.scrollWidth <= scrolledContainer.scrollLeft + scrolledContainer.clientWidth + 16) {
            scrolledContainer.scrollLeft = 0;
        }
    }
};

Vue.prototype.$byLocale = function (target, locale = this.$i18n.locale) {
    return target ? target[locale] : null;
};

Vue.prototype.$setForLocale = function (value = null) {
    return this.$i18n?.locales.reduce((obj, locale) => {
        return { ...obj, [locale.code]: value };
    }, {});
};

Vue.prototype.$activeLocale = function () {
    return this.$store.state.data.contentLocale || this.$i18n.locale;
};

Vue.prototype.$animation = function (entries, observer) {

    const entry = entries[0];
    const target = entries[0].target;
    const animationDelay = target.dataset.animationDelay;
    const delay = animationDelay ? parseFloat(animationDelay) * 1000 : 0;
    const baseAnimationClass = 'animate__animated';

    if (!target.classList.contains(baseAnimationClass)) {
        target.style.opacity = 0;
    }

    if (entry.isIntersecting) {
        setTimeout(() => {
            target.classList.add(baseAnimationClass);
            target.classList.add(`animate__${ target.dataset.animation }`);
            target.style.opacity = 1;
        }, delay);
    }
};

Vue.prototype.$src = function (src) {
    return `${ this.$config.apiUrl }${ src }`;
};

Vue.prototype.$copyToClipboard = function (value) {
    let tempInput = document.createElement('input');
    tempInput.style.position = 'absolute';
    tempInput.style.opacity = 0;
    document.body.appendChild(tempInput);
    tempInput.setAttribute('type', 'text');
    tempInput.setAttribute('value', value);
    tempInput.select();
    tempInput.setSelectionRange(0, 99999);
    document.execCommand('copy');
    document.body.removeChild(tempInput);
};

Vue.prototype.$dark = function () {
    return this.$vuetify.theme.dark;
};

Vue.prototype.$nameInitials = function (name) {
    return name.match(/\b(\w)/g).join('');
};

Vue.prototype.$formatBytes = function (bytes, decimals = 2) {
    if (!+bytes) return '0 Bytes';

    const k = 1024;
    const dm = decimals < 0 ? 0 : decimals;
    const sizes = [ 'Bytes', 'KB', 'MB', 'GB', 'TB', 'PB', 'EB', 'ZB', 'YB' ];

    const i = Math.floor(Math.log(bytes) / Math.log(k));

    return `${ parseFloat((bytes / Math.pow(k, i)).toFixed(dm)) } ${ sizes[i] }`;
};

Vue.prototype.$isSame = function (p1, p2) {
    return JSON.stringify(p1) === JSON.stringify(p2);
};
