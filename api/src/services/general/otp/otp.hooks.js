const {authenticate} = require('@feathersjs/authentication').hooks;
const {GeneralError, MethodNotAllowed, Unprocessable} = require('@feathersjs/errors');
const {generateOTP} = require('../../../otp-enerator');
const {sendMail} = require('../../../mail');
const checkOtp = require('../../../../src/hooks/check-otp');

const createOTP = () => {
    return async context => {
        try {

            const email = context.data.email || context.params.user.email
            const otp = await generateOTP()
            context.data = {otp, email}

            return context

        } catch (error) {
            throw new GeneralError(error);
        }
    }
}

const sendOtpToEmail = () => {
    return async context => {
        try {

            const {otp, id, email} = context.result

            const newMail = await sendMail({
                to: email,
                subject: 'OTP Code',
                template: 'otpCode',
                data: {templateTitle: 'OTP CODE ', otp}
            });

            setTimeout(async () => context.app.service('otp').remove(id, context.params), 5 * 60 * 1000);

            if (newMail?.response?.includes('OK')){

                context.result = {id, email, otp: null}

                return context

            }else {
                throw new Unprocessable(email);
            }

        } catch (error) {
            throw new GeneralError(error);
        }
    }
}

module.exports = {
    before: {
        all: [authenticate('jwt')],
        find: [checkOtp()],
        create: [createOTP()],
        get: [()=> new MethodNotAllowed()],
        update: [()=> new MethodNotAllowed()],
        patch: [()=> new MethodNotAllowed()],
        remove: []
    },

    after: {
        all: [],
        find: [],
        get: [],
        create: [sendOtpToEmail()],
        update: [],
        patch: [],
        remove: []
    },

    error: {
        all: [],
        find: [],
        get: [],
        create: [],
        update: [],
        patch: [],
        remove: []
    }
};
