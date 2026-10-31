const { TooManyRequests } = require('@feathersjs/errors');

// Yaddaşda saxlanılan sadə limit: hər IP üçün `windowMs` ərzində ən çox `max`
// sorğu. Bir API prosesi üçün kifayətdir (PM2 fork rejimi, 1 nüsxə).
const hits = new Map();

// Köhnə qeydlər vaxtaşırı silinir ki, yaddaş böyüməsin
setInterval(() => {
    const now = Date.now();
    hits.forEach((entry, key) => {
        if (entry.resetAt <= now) hits.delete(key);
    });
}, 60 * 1000).unref();

let warned = false;

module.exports = ({ max = 5, windowMs = 10 * 60 * 1000, key = 'default' } = {}) => {
    return context => {
        const ip = context.params.clientIp;

        // IP bilinmirsə (məs. nginx X-Real-IP göndərmir) limit tətbiq olunmur —
        // yoxsa bütün istifadəçilər bir "127.0.0.1" kimi birlikdə bloklanardı
        if (!ip) {
            if (!warned) {
                console.warn('[rate-limit] client IP unknown — add "proxy_set_header X-Real-IP $remote_addr;" to nginx');
                warned = true;
            }
            return context;
        }

        const now = Date.now();
        const id = `${key}:${ip}`;
        let entry = hits.get(id);

        if (!entry || entry.resetAt <= now) {
            entry = { count: 0, resetAt: now + windowMs };
            hits.set(id, entry);
        }

        entry.count += 1;

        if (entry.count > max) {
            const retryAfter = Math.ceil((entry.resetAt - now) / 1000);
            throw new TooManyRequests('Too many requests, please try again later', { retryAfter });
        }

        return context;
    };
};

// Testlər üçün
module.exports._reset = () => hits.clear();
