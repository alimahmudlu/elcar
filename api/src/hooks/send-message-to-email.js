require('dotenv').config();
const { sendMail } = require( '../mail' );
const { messages } = require( '../email-templates' );

// eslint-disable-next-line no-unused-vars
module.exports = (options = {}) => {
    return async context => {

        console.log()

        await sendMail( {
            to: 'kamal.balaev@gmail.com',//'info@elcar.az',
            replyTo: 'info@elcar.az',
            subject: 'İstifadəçi mesajı',
            template: 'messages',
            data: context.result,
        } );

        return context;
    };
};
