// Initializes the `otp` service on path `/otp`
const {Otp} = require('./otp.class');
const hooks = require('./otp.hooks');

module.exports = function (app) {
    const options = {
        paginate: false
    };

    // Initialize our service with any options it requires
    app.use('/send-otp', new Otp(options, app));
    app.use('/verify-otp', new Otp(options, app));

    // Get our initialized service so that we can register hooks
    const sendEmailService = app.service('send-otp');
    const verifyOtpService = app.service('verify-otp');

    sendEmailService.hooks(hooks);
    verifyOtpService.hooks(hooks);
};
