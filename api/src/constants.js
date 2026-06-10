require('dotenv').config();
module.exports = {
    OTP_LENGTH: 6,
    OTP_CONFIG: {
        upperCaseAlphabets: false,
        lowerCaseAlphabets: false,
        specialChars: false,
    },
    MAIL_SETTINGS: {
        service: 'gmail',
        host: 'smtp.gmail.com',
        port: 587,
        secure: true,
        requireTLS: true,
        auth: {
            user: process.env.EMAIL_USER,
            pass: process.env.EMAIL_PASSWORD,
        },
    },
};
