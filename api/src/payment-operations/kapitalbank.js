require('dotenv').config();
const {NODE_ENV} = process.env;
const isDev = NODE_ENV === "development";

const fs = require('fs');
const https = require('https')
const axios = require('axios')
const { parseString } = require("xml2js");


const httpsAgent = new https.Agent({
    rejectUnauthorized: false,
    cert: fs.readFileSync('src/elcar_merchant.crt'),
    key: fs.readFileSync('src/elcar_merchant.key'),
})
// ${isDev ? 'tstpg': '3dsrv'}
axios.defaults.baseURL = `https://tstpg.kapitalbank.az:5443/`

const instance = axios.create({
    httpsAgent,
    headers: {
        'Content-Type' : 'application/xml'
    }
})

const url = (endPoint) => {
    return `https://elcar.az/${endPoint}`
}

exports.KapitalBank = class KapitalBank {

    constructor(ctx, order, options, lang) {
        this.ctx = ctx
        this.lang = lang.toUpperCase()
        this.order = order
        this.options = options
        this.currency = 944
        this.merchant = 'E1000010'
    }

    get totalAmount(){
        const amount = this.order.products.reduce((total, product) => {
            return total += product.detail.discountedPrice || product.detail.price
        }, 0)

        return amount  * 100
    }

    get purchaseBody(){
        return `<?xml version="1.0" encoding="UTF-8"?>
                <TKKPG>
                      <Request>
                              <Operation>CreateOrder</Operation>
                              <Language>${this.lang}</Language>
                              <Order>
                                    <OrderType>Purchase</OrderType>
                                    <Merchant>${this.merchant}</Merchant>
                                    <Amount>${this.totalAmount}</Amount>
                                    <Currency>${this.currency}</Currency>
                                    <Description>${this.order.note}</Description>
                                    <ApproveURL>${url('approve')}</ApproveURL>
                                    <CancelURL>${url('cancel')}</CancelURL>
                                    <DeclineURL>${url('decline')}</DeclineURL>
                              </Order>
                      </Request>
                </TKKPG>`
    }

    checkOrderBody(operation, orderId, sessionId){
        return `<?xml version="1.0" encoding="UTF-8"?>
                <TKKPG>
                    <Request>
                        <Operation>${operation}</Operation>
                        <Language>${this.lang}</Language>
                        <Order>
                            <Merchant>${this.merchant}</Merchant>
                            <OrderID>${orderId}</OrderID>
                        </Order>
                        <SessionID>${sessionId}</SessionID>
                    </Request>
                </TKKPG>`
    }

    async fetchData(body){
        try {

            const {data} = await instance.post('Exec', body)
            let jsonData

            await parseString(data, (error, result)=>  {

                if(error) throw new Error(error)

                jsonData = JSON.parse(JSON.stringify(result))
            })

            const {TKKPG, Order} = jsonData
            if(TKKPG){
                return TKKPG?.Response[0]
            }else if (Order){
                return Order.row[0]
            }else{
                throw new Error()
            }

        }catch (error) {
            if(error) throw new Error(error)
        }
    }

    async createOrder(){
        return await this.fetchData(this.purchaseBody)
    }

    async getOrderStatus(orderId, sessionId){
        return await this.fetchData(this.checkOrderBody('GetOrderStatus', orderId, sessionId))
    }

    async getOrderInformation(orderId, sessionId){
        return await this.fetchData(this.checkOrderBody('GetOrderInformation', orderId, sessionId))
    }

};
