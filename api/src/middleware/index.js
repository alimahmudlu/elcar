const LOOPBACK = new Set([ '127.0.0.1', '::1', '::ffff:127.0.0.1' ]);

// eslint-disable-next-line no-unused-vars
module.exports = function (app) {

    // Müştərinin real IP-si (rate limit üçün). API nginx arxasındadır: nginx
    // X-Real-IP başlığını qoyur. Başlığa yalnız sorğu lokal nginx-dən gələndə
    // inanılır — kənardan göndərilmiş saxta başlıq nəzərə alınmır.
    app.use((req, res, next) => {
        const remote = req.socket?.remoteAddress;
        const forwarded = req.headers['x-real-ip'];

        let clientIp = null;
        if (LOOPBACK.has(remote)) {
            if (typeof forwarded === 'string' && forwarded.trim()) clientIp = forwarded.trim();
        } else if (remote) {
            clientIp = remote;
        }

        req.feathers = { ...req.feathers, clientIp };
        next();
    });

};
