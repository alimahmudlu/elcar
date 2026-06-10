// Use this hook to manipulate incoming or outgoing data.
// For more information on hooks see: http://docs.feathersjs.com/api/hooks.html
const errors = require('@feathersjs/errors');
// eslint-disable-next-line no-unused-vars
module.exports = (sort = {_id: -1}) => {
    return context => {

        const otpService = context.app.service('send-otp');
        const OTP = context.data.otp
        const hasOTP = otpService.store[OTP.id] && parseInt(otpService.store[OTP.id].otp) === parseInt(OTP.otp)

        if (hasOTP) {
            return context
        } else {
            throw new errors.NotAcceptable();
        }
    }
};
