const { authenticate } = require('@feathersjs/authentication').hooks;
const { authorize } = require('feathers-casl').hooks;
const { iff } = require('feathers-hooks-common');
const allowForSite = require('../../../hooks/allow-for-site');
const checkAbilities = require('../../../hooks/check-abilities');
const { cache } = require('feathers-hooks-common');
const CacheMap = require('@feathers-plus/cache');
const cacheMap = CacheMap({ max: 100 });
// const ObjectId = require('mongoose').Types.ObjectId;

const setLean = require('../../../hooks/set-lean');
const setLanguage = require('../../../hooks/set-language');
const sortData = require('../../../hooks/sort-data');
const beforeContentSave = require('../../../hooks/before-content-save');

const setSlugData = () => {
    return async context => {

        const params = JSON.parse(JSON.stringify(context.params))
        params.query.noPagination = true
        params.query.section = context.data.section

        const category = await context.app.service('categories').get(context.data.category, params)
        const brand = await context.app.service('brands').get(context.data.brand, params)
        const model = await context.app.service('models').get(context.data.model, params)
        const characteristics = await context.app.service('characteristics').find(params)

        function characteristicById(id) {
            return characteristics?.find(char => char._id.toString() === id)
        }

        const title = {
            az: `${ category.name.az } ${ brand.name } ${ model.name }`,
            en: `${ category.name.en } ${ brand.name } ${ model.name }`,
            ru: `${ category.name.ru } ${ brand.name } ${ model.name }`,
        }

        context.data.characteristicGroups.forEach(group => {
            group.characteristics.forEach(char => {

                const item = Object.assign({}, characteristicById(char.item))._doc
                const attrs = item.component.attrs

                if (item.component.name === 'input' && attrs.addToSlug && item.categories.some(category => category._id.toString() === context.data.category)) {

                    const suffix = attrs.suffix

                    title.az += char.value ? ` ${ char.value }${ suffix ? suffix : '' }` : ''
                    title.en += char.value ? ` ${ char.value }${ suffix ? suffix : '' }` : ''
                    title.ru += char.value ? ` ${ char.value }${ suffix ? suffix : '' }` : ''
                }
            })
        })

        context.data.title = title

        return context
    }
}

const populateForSite = () => {
    return async context => {
        context.params.query.$populate = [
            {
                path: "category",
                model: "categories",
                select: 'name'
            },
            {
                path: "brand",
                model: "brands",
                select: 'name -logo -_id',
            },
            {
                path: "model",
                model: "models",
                select: 'name -brand -_id'
            },
            {
                path: "image",
                model: "uploads",
                select: 'src -_id'
            },
            {
                path: 'characteristicGroups',
                populate: [
                    {
                        path: 'group',
                        model: 'characteristic_groups',
                        // select: 'name photo -_id'
                    },
                    {
                        path: 'image',
                        model: 'uploads',
                        select: 'src -_id'
                    },
                    {
                        path: 'characteristics',
                        populate: [
                            {
                                path: 'item',
                                model: 'characteristics',
                            },
                        ],
                    }
                ]
            },
        ]
        return context
    }
}

const setListModelForSite = () => {
    return async context => {

        const lang = context.params.headers['content-language']
        const params = JSON.parse(JSON.stringify(context.params))
        // params.query.noPagination = true
        // params.query.section = context.result.section

        let options = await context.app.service('characteristic-options').Model.find({
            section: params.query.section
        })

        if (context.result.data) {
            context.result.data = await Promise.all(context.result.data.map(async item => {
                return await setItemForSite(item, options, lang, true)
            }))
        } else {
            context.result = await Promise.all(context.result.map(async item => {
                return await setItemForSite(item, options, lang, true)
            }))
        }

        return context
    }
}

const setDetailModelForSite = () => {
    return async context => {

        console.log(context)

        const lang = context.params.headers['content-language']
        const params = JSON.parse(JSON.stringify(context.params))
        // params.query.noPagination = true
        // params.query.section = context.result.section

        let options = await context.app.service('characteristic-options').Model.find({
            section: context.result.section
        })

        context.result = await setItemForSite(context.result, options, lang)

        return context
    }
}

const setItemForSite = async (item, options, lang, list) => {
    return new Promise(async (resolve)=> {

        function hasValue(value) {
            return value !== null && value !== "" && typeof value !== "undefined"
        }

        item.characteristicGroups = item.characteristicGroups.filter(group => group.visible && group.group && typeof group.group === 'object')

        item.itemChars = []

        await item.characteristicGroups.forEach(group => {

            if(!list){

                group.title = group?.group?.name
                group.description = group?.description[lang]
                group.photo = group.group.photo

            }else{
                delete group.description
                delete group.image
            }

            group.characteristics = group.characteristics.filter(char => char.visible && char.item && typeof char.item === 'object')

            group.characteristics.forEach(char => {

                const newChar = JSON.parse(JSON.stringify(char))

                const attrs = newChar?.item?.component?.attrs

                char.name = newChar?.item?.name

                const hasInCategory = newChar?.item?.categories.find(category => category._id.toString() === item.category._id.toString())

                if(attrs && attrs.showOnItem && hasInCategory){
                    char.attrs = attrs
                }

                switch (newChar?.item?.component?.name) {
                    case 'select':
                        if (Array.isArray(char.value)) {
                            const value = []
                            char.value.forEach(val => {
                                let option = options.find(option => option._id.toString() === val)
                                if (hasValue(option?.name)) value.push(`${ option.name }${ attrs?.suffix ? ` ${ attrs.suffix }` : '' }`)
                            })
                            char.value = value
                        }
                        else {
                            let option = char.value && options.find(option => option._id.toString() === char.value)
                            char.value = option?.name ? `${ option.name }${ attrs?.suffix ? ` ${ attrs.suffix }` : '' }` : null
                        }
                        break;
                    case 'input':
                        char.value = char?.value && typeof char.value === 'object'
                            ? hasValue(char.value[lang])
                                ? `${ char.value[lang] }${ attrs?.suffix ? ` ${ attrs.suffix }` : '' }`
                                : null
                            : hasValue(char.value)
                                ? `${ char.value }${ attrs?.suffix ? ` ${ attrs.suffix }` : '' }`
                                : null;
                        break;
                }

                delete char.visible
                delete char.item

            })

            delete group.group

        })

        if(list){
            delete item.alternatives
        }

        resolve(item)
    })
}

const filterQueries = () => {
    return context => {

        const { priceRange } = context.params.query

        if (priceRange) {

            context.params.query = {
                ...context.params.query,
                discountedPrice: {
                    $gte: priceRange[0],
                    $lte: priceRange[1],
                }
            }

            delete context.params.query.priceRange

        }

        context.params.query.$and = []
        const ignoredParams = ['category', 'brand', 'model', 'priceRange', 'section', 'top', '$skip', '$limit', '$select', '$sort', '$and', '$or', 'noPagination', 'filter']

        Object.entries(context.params.query).forEach(([key, val]) => {
            if (!ignoredParams.includes(key) && (Array.isArray(val) && val.length || !Array.isArray(val) && val)){
                context.params.query.$and.push({
                    [`characteristicGroups.characteristics.${key}`]: val
                })
            }
        })

        return context
    }
}

module.exports = {
    before: {
        all: [],
        find: [ iff(allowForSite(), filterQueries()).else(authenticate('jwt'), checkAbilities(), authorize({ adapter: 'feathers-mongoose' })), setLean(), sortData(), cache(cacheMap) ],
        get: [ iff(allowForSite(), setLean(), populateForSite()).else(authenticate('jwt'), checkAbilities(), authorize({ adapter: 'feathers-mongoose' }), setLean({ lean: true })), cache(cacheMap) ],
        create: [ authenticate('jwt'), checkAbilities(), authorize({ adapter: 'feathers-mongoose' }), setSlugData(), beforeContentSave() ],
        update: [ authenticate('jwt'), checkAbilities(), authorize({ adapter: 'feathers-mongoose' }), setSlugData(), beforeContentSave() ],
        patch: [ authenticate('jwt'), checkAbilities(), authorize({ adapter: 'feathers-mongoose' }), setSlugData(), beforeContentSave() ],
        remove: [ authenticate('jwt'), checkAbilities(), authorize({ adapter: 'feathers-mongoose' }) ]
    },

    after: {
        all: [],
        find: [ setLanguage(), setListModelForSite(), cache(cacheMap) ],
        get: [ iff(allowForSite(), setLanguage(), setDetailModelForSite()), cache(cacheMap) ],
        create: [],
        update: [],
        patch: [],
        remove: []
    },

    error: {
        all: [],
        find: [],
        get: [],
        create: [],
        update: [],
        patch: [],
        remove: []
    }
};
