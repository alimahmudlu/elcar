// Məhsul detal keşi — products hook-ları və reytinq yenilənməsi eyni keşi paylaşır
const CacheMap = require('@feathers-plus/cache');

const cacheMap = CacheMap({ max: 100 });

const clearProductsCache = () => {
    if (typeof cacheMap.reset === 'function') cacheMap.reset();
    else if (typeof cacheMap.clear === 'function') cacheMap.clear();
};

module.exports = { cacheMap, clearProductsCache };
