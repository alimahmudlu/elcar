const { authenticate } = require('@feathersjs/authentication').hooks;
const { authorize } = require('feathers-casl').hooks;
const { iff } = require('feathers-hooks-common');
const { BadRequest } = require('@feathersjs/errors');
const { Types } = require('mongoose');
const allowForSite = require('../../../hooks/allow-for-site');
const checkAbilities = require('../../../hooks/check-abilities');
const sortData = require('../../../hooks/sort-data');
const rateLimit = require('../../../hooks/rate-limit');
const { clearProductsCache } = require('../products/products.cache');

// Sayt yalnız təsdiqlənmiş rəyləri, yalnız lazımi sahələrlə və məhsula görə görür
const siteFindQuery = () => {
    return context => {
        const { product, $skip, $limit } = context.params.query || {};

        if (!product) throw new BadRequest('product is required');

        context.params.query = {
            product,
            status: 'approved',
            $select: [ 'fullName', 'rating', 'text', 'createdAt' ],
            $sort: { createdAt: -1 },
            $skip: Math.max(Number($skip) || 0, 0),
            $limit: Math.min(Number($limit) || 20, 50)
        };

        return context;
    };
};

// Saytdan gələn rəydə yalnız icazəli sahələr qalır, status həmişə "pending"
const sanitizeSiteReview = () => {
    return context => {
        const { product, fullName, rating, text, website } = context.data || {};

        // Bot tələsi: gizli "website" sahəsi doldurulubsa rədd edilir
        if (website) throw new BadRequest('Invalid review');

        context.data = {
            product,
            fullName,
            rating: Number(rating),
            text,
            status: 'pending'
        };

        return context;
    };
};

// Admin siyahısında məhsulun adı göstərilsin
const populateProductForAdmin = () => {
    return context => {
        context.params.query.$populate = { path: 'product', select: 'title section' };
        return context;
    };
};

const flattenProductTitle = () => {
    return context => {
        const lang = context.params.headers?.['content-language'] || 'az';
        const items = context.result?.data || context.result || [];

        (Array.isArray(items) ? items : [ items ]).forEach(item => {
            const title = item?.product?.title;
            if (title && typeof title === 'object') {
                item.productTitle = title[lang] || title.az;
            }
        });

        return context;
    };
};

// Rəy dəyişəndə məhsulun orta reytinqi və təsdiqlənmiş rəy sayı yenidən hesablanır
const updateProductRating = () => {
    return async context => {
        const results = Array.isArray(context.result) ? context.result : [ context.result ];
        const productIds = [ ...new Set(results.map(r => String(r?.product?._id || r?.product)).filter(Boolean)) ];

        const Reviews = context.app.service('reviews').Model;
        const Products = context.app.service('products').Model;

        await Promise.all(productIds.map(async id => {
            const [ stats ] = await Reviews.aggregate([
                { $match: { product: new Types.ObjectId(id), status: 'approved' } },
                { $group: { _id: null, avg: { $avg: '$rating' }, count: { $sum: 1 } } }
            ]);

            await Products.updateOne({ _id: id }, {
                rating: stats ? Math.round(stats.avg * 10) / 10 : 0,
                reviewCount: stats ? stats.count : 0
            });
        }));

        if (productIds.length) clearProductsCache();

        return context;
    };
};

const adminOnly = [ authenticate('jwt'), checkAbilities(), authorize({ adapter: 'feathers-mongoose' }) ];

module.exports = {
    before: {
        all: [],
        find: [ iff(allowForSite(), siteFindQuery()).else(...adminOnly, populateProductForAdmin(), sortData()) ],
        get: [ ...adminOnly ],
        // Saytdan: bir IP-dən 10 dəqiqədə ən çox 3 rəy
        create: [ iff(allowForSite({ methods: [ 'create' ] }), rateLimit({ key: 'reviews', max: 3 }), sanitizeSiteReview()).else(...adminOnly) ],
        update: [ ...adminOnly ],
        patch: [ ...adminOnly ],
        remove: [ ...adminOnly ]
    },

    after: {
        all: [],
        find: [ iff(context => !context.path.startsWith('site/'), flattenProductTitle()) ],
        get: [],
        create: [ updateProductRating() ],
        update: [ updateProductRating() ],
        patch: [ updateProductRating() ],
        remove: [ updateProductRating() ]
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
