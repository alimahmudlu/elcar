const otpGenerator = require('otp-generator');
const { OTP_LENGTH, OTP_CONFIG } = require('./constants');
module.exports.generateOTP = () => {
    return otpGenerator.generate(OTP_LENGTH, OTP_CONFIG);
};
