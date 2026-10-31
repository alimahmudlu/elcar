const LOOPBACK = new Set([ '127.0.0.1', '::1', '::ffff:127.0.0.1' ]);

/**
 * Müştərinin real IP-si (rate limit üçün). API nginx arxasındadır: nginx
 * X-Real-IP başlığını qoyur. Başlığa yalnız bağlantı lokal nginx-dən gələndə
 * inanılır — kənardan göndərilmiş saxta başlıq nəzərə alınmır.
 * Bilinmirsə null qaytarır.
 */
module.exports = function clientIp(remoteAddress, headers = {}) {
    const forwarded = headers['x-real-ip'];

    if (LOOPBACK.has(remoteAddress)) {
        return typeof forwarded === 'string' && forwarded.trim() ? forwarded.trim() : null;
    }

    return remoteAddress || null;
};
