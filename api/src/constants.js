require('dotenv').config();
module.exports = {
    OTP_LENGTH: 6,
    OTP_CONFIG: {
        upperCaseAlphabets: false,
        lowerCaseAlphabets: false,
        specialChars: false,
    },
    MAIL_SETTINGS: {
        // Göndərən poçtun serveri EMAIL_HOST-dan; elcar.az poçtu Mail.ru-dadır.
        // EMAIL_PASSWORD tətbiq parolu olmalıdır.
        // 587 + STARTTLS: serverdə 25 və 465 portları bağlıdır.
        host: process.env.EMAIL_HOST || 'smtp.mail.ru',
        port: 587,
        secure: false,
        requireTLS: true,
        connectionTimeout: 10000,
        greetingTimeout: 10000,
        socketTimeout: 20000,
        auth: {
            user: process.env.EMAIL_USER,
            pass: process.env.EMAIL_PASSWORD,
        },
    },
};
