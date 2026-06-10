// eslint-disable-next-line no-unused-vars

require('dotenv').config();
const errors = require('@feathersjs/errors');

const {authenticate} = require('@feathersjs/authentication').hooks;
const {authorize} = require('feathers-casl').hooks;
const {iff} = require('feathers-hooks-common');
const allowForSite = require('../../../hooks/allow-for-site');
const checkAbilities = require('../../../hooks/check-abilities');
const {cache} = require('feathers-hooks-common');
const CacheMap = require('@feathers-plus/cache');
const cacheMap = CacheMap({max: 100});
const setLean = require('../../../hooks/set-lean');
const setLanguage = require('../../../hooks/set-language');
const sortData = require('../../../hooks/sort-data');
const {sendMail} = require('../../../mail');
const {order} = require('../../../email-templates');
const deleteSubItems = require('../../../hooks/delete-sub-items');

const {KapitalBank} = require('../../../payment-operations/kapitalbank')

const sendToMail = () => {
    return async context => {

        const {purchaser, email, phone, note, products} = context.result;

        const productIds = products.map(p => p.detail.toString())

        const allProducts = await context.app.service('products').Model.find({_id: productIds})

        const templateProducts = allProducts.map((product, i) => {
            return {
                title: product.title,
                slug: product.slug,
                section: product.section,
                price: product.price,
                discount: product.discount,
                discountedPrice: product.discountedPrice,
                amount: products[i].amount,
            }
        })

        const template = await order({purchaser, email, phone, note, products: templateProducts})

        await sendMail({
            // to: 'info@elcar.az',
            to: 'kamal.isak@mail.ru',
            subject: 'Sifariş',
            template,
        });

        return context;
    };
};

const setTransactions = (opt) => {
    return async context => {

        const ordersModel = context.app.service(context.path).Model;
        const order = await ordersModel.findById(context.result._id)
        const lang = context.params.headers['content-language']
        const transactionsService = context.app.service('bank-transactions');
        const bank = new KapitalBank(context, order, opt, lang)

        try {

            /* Create Order on Bank */
            const transaction = await bank.createOrder()

            /* Create Order Transaction in DB */
            const newTransaction = await transactionsService.create({
                order: order._id,
                operation: transaction.Operation[0],
                status: transaction.Status[0],
                bank: {
                    orderId: transaction.Order[0].OrderID[0],
                    sessionId: transaction.Order[0].SessionID[0],
                    url: transaction.Order[0].URL[0],
                },
            }, context.params)

            /* Create redirect url for frontend */
            const {orderId, sessionId, url} = newTransaction.bank
            const redirectURL = `${url}?ORDERID=${orderId}&SESSIONID=${sessionId}`

            /* Get Order Status */
            await bank.getOrderStatus(orderId, sessionId)

            const getOrderInformation = async ()=> {

                /* Get Order Information */
                const orderInformation = await bank.getOrderInformation(orderId, sessionId)

                if(transaction.Status[0] === '00'){

                    /* Update Order Detail Status in DB */
                    await ordersModel.findByIdAndUpdate(order._id, {status: orderInformation.Orderstatus[0]})

                    /* Create Order Transaction Detail in DB */
                    await transactionsService.create({
                        order: order._id,
                        operation: 'GetOrderInformation',
                        status: transaction.Status[0],
                        bank: {
                            orderId: orderInformation.id[0],
                            sessionId: orderInformation.SessionID[0],
                            encryptedId: orderInformation.EncryptedId[0],
                            merchantID: orderInformation.MerchantID[0],
                            terminalID: orderInformation.TerminalID[0],
                            amount: orderInformation.Amount[0],
                            currency: orderInformation.Currency[0],
                            orderStatus: orderInformation.Orderstatus[0],
                            orderType: orderInformation.OrderType[0],
                            orderSubType: orderInformation.OrderSubType[0],
                            orderLanguage: orderInformation.OrderLanguage[0],
                            description: orderInformation.Description[0],
                            approveURL: orderInformation.ApproveURL[0],
                            cancelURL: orderInformation.CancelURL[0],
                            declineURL: orderInformation.DeclineURL[0],
                            receipt: orderInformation.Receipt[0],
                            twoId: orderInformation.twoId[0],
                            extSystemProcess: orderInformation.ExtSystemProcess[0],
                            fee: orderInformation.Fee[0],
                            email: orderInformation.Email[0],
                            refundAmount: orderInformation.RefundAmount[0],
                            refundCurrency: orderInformation.RefundCurrency[0],
                            refundDate: orderInformation.RefundDate[0],
                            createDate: orderInformation.createDate[0],
                            lastUpdateDate: orderInformation.lastUpdateDate[0],
                            payDate: orderInformation.payDate[0],
                            TWODate: orderInformation.TWODate[0],
                            TWOTime: orderInformation.TWOTime[0],
                        },
                    }, context.params)

                }
                else{

                    await ordersModel.findByIdAndUpdate(order._id, {status: transaction.Status[0]})

                    /* Create Order Transaction Detail in DB */
                    await transactionsService.create({
                        order: order._id,
                        operation: 'GetOrderInformation',
                        status: transaction.Status[0],
                        bank: {
                            orderId: orderInformation.id[0],
                            sessionId: orderInformation.SessionID[0],
                        },
                    }, context.params)

                }

            }

            /* Get Order Information After 3 Minutes */
            setTimeout(async ()=> await getOrderInformation(), 180000)

            context.result = {...newTransaction.bank, url: redirectURL}

            return context

        } catch (error) {

            await ordersModel.findByIdAndRemove(context.result._id)

            throw new errors.GeneralError(error);
        }
    }
}


module.exports = {
    before: {
        all: [],
        find: [authenticate('jwt'), checkAbilities(), authorize({adapter: 'feathers-mongoose'}), setLean(), sortData(), cache(cacheMap)],
        get: [authenticate('jwt'), checkAbilities(), authorize({adapter: 'feathers-mongoose'}), setLean(), cache(cacheMap)],
        create: [iff(allowForSite({methods: ['create']})).else(authenticate('jwt'), checkAbilities(), authorize({adapter: 'feathers-mongoose'}))],
        update: [authenticate('jwt'), checkAbilities(), authorize({adapter: 'feathers-mongoose'})],
        patch: [authenticate('jwt'), checkAbilities(), authorize({adapter: 'feathers-mongoose'})],
        remove: [authenticate('jwt'), checkAbilities(), authorize({adapter: 'feathers-mongoose'})]
    },

    after: {
        all: [],
        find: [setLanguage(), cache(cacheMap)],
        get: [setLanguage(), cache(cacheMap)],
        create: [
            iff(
                allowForSite({methods: ['create']}),
                setTransactions({bank: 'KapitalBank', operation: 'CreateOrder', type: 'Purchase'})
            )
        ],
        update: [],
        patch: [],
        remove: [
            deleteSubItems({
                modules: [
                    {key: 'order', service: 'bank-transactions'},
                ]
            })
        ]
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
