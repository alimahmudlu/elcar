const clientIp = require('./client-ip');

// eslint-disable-next-line no-unused-vars
module.exports = function (app) {

    // REST sorğuları üçün müştəri IP-si (Socket.IO üçün app.js-ə bax)
    app.use((req, res, next) => {
        req.feathers = { ...req.feathers, clientIp: clientIp(req.socket?.remoteAddress, req.headers) };
        next();
    });

};
