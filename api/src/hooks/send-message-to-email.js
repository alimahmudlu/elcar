require('dotenv').config();
const { sendMail } = require( '../mail' );
const { messages } = require( '../email-templates' );

// eslint-disable-next-line no-unused-vars
module.exports = (options = {}) => {
    return async context => {

        // Bildiriş ünvanı .env-dən (NOTIFY_EMAIL), yoxdursa info@elcar.az
        await sendMail( {
            to: process.env.NOTIFY_EMAIL || 'info@elcar.az',
            replyTo: 'info@elcar.az',
            subject: 'İstifadəçi mesajı',
            template: 'messages',
            data: context.result,
        } );

        return context;
    };
};
