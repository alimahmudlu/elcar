const nodemailer = require('nodemailer');
const { MAIL_SETTINGS } = require('./constants');
const transporter = nodemailer.createTransport(MAIL_SETTINGS);
const templates = require('./email-templates');

module.exports.sendMail = async ({from, to, subject, template, data}) => {
    try {

        const html = await templates[template]({...data, subject});

        return await transporter.sendMail({
            from: from || MAIL_SETTINGS.auth.user,
            to,
            subject,
            html
        });

    } catch (error) {
        console.log(error);
        return false;
    }
};
