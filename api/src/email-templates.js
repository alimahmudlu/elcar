require('dotenv').config();

module.exports.order = (params) => {
    return `<table style="background: #ebecef; padding: 10px; width: 100%; margin: 0 auto">
                <tbody>
                    <tr>
                        <td colspan="3" style="padding-left: 5px">
                            <h1 style="font-weight: 900; font-size: 24px; margin: 0;">${ params.templateTitle || process.env.APP_NAME }</h1>
                        </td>
                    </tr>
                    <tr>
                        <td colspan="3">
                            <hr/>
                        </td>
                    </tr>
                    <tr>
                        <th align="center" width="10px">
                            <b style="font-size: 20px; line-height: 0;">&#9786;</b>
                        </th>
                        <th align="left" style="padding: 8px; white-space: nowrap">
                            Müştəri:
                        </th>
                        <td style="padding: 8px;">${ params.purchaser },</td>
                    </tr>
                    <tr>
                        <th align="center" style="padding-top: 8px;vertical-align: top;">
                            <b>&#9993;</b>
                        </th>
                        <th align="left" style="padding: 8px;">
                            Email:
                        </th>
                        <td style="padding: 8px;">${ params.email },</td>
                    </tr>
                    <tr>
                        <th align="center" style="padding-top: 8px;vertical-align: top;">
                            <b>&#9742;</b>
                        </th>
                        <th align="left" style="padding: 8px;">
                            Telefon:
                        </th>
                        <td style="padding: 8px;">${ params.phone },</td>
                    </tr>
                    <tr>
                        <th align="center" style="padding-top: 8px; vertical-align: top;">
                            <b>&#9998;</b>
                        </th>
                        <th align="left" style="padding: 8px; vertical-align: top;">
                            Qeyd:
                        </th>
                        <td style="padding: 8px; line-height: 24px;">${ params.note }</td>
                    </tr>
                    <tr>
                        <th align="center" style="padding: 16px 8px; vertical-align: top;">
                            <b>&#9889;</b>
                        </th>
                        <th align="left" style="padding:  8px; vertical-align: top;">
                            Məhsullar:
                        </th>
                        <td style="padding: 16px 8px; line-height: 24px;">
                            <table style="background: #e2e2e3; width: 100%;">
                                <thead>
                                    <tr>
                                        <th style="text-align: left; padding: 5px; border-bottom: 2px solid #ddd;">Adı</th>
                                        <th style="text-align: left; padding: 5px; border-bottom: 2px solid #ddd;">Miqdarı</th>
                                        <th style="text-align: left; padding: 5px; border-bottom: 2px solid #ddd;">Endirim</th>
                                        <th style="text-align: left; padding: 5px; border-bottom: 2px solid #ddd;">Köhnə qiymət</th>
                                        <th style="text-align: left; padding: 5px; border-bottom: 2px solid #ddd;">Qiymət</th>
                                    </tr>
                                </thead>
                                <tbody>
                                ${ params.products.map(product => {
                                    return `<tr>
                                                <td style="padding: 5px;">
                                                    <a href="http://localhost:3113/elektrikli-avtomobiller/elektrik-muherrikli-audi-q5-e-tron-2022-85kwh">
                                                        ${ product.title }
                                                    </a>
                                                </td>
                                                <td style="padding: 5px;">
                                                    ${ product.amount }
                                                </td>
                                                <td style="padding: 5px;">
                                                    ${ product.discount || 0 } %
                                                </td>
                                                <td style="padding: 5px;">
                                                    <s>${ product.discountedPrice ? product.price + ' AZN' : '' }</s>
                                                </td>
                                                <td style="padding: 5px;">
                                                    ${ product.discountedPrice || product.price } AZN
                                                </td>
                                            </tr>`
                                }).join("") }
                                </tbody>
                            </table>
                        </td>
                    </tr>
                </tbody>
            </table>`
};

module.exports.messages = (params) => {
    return `<table style="background: #ebecef; padding: 10px; width: 100%; margin: 0 auto">
                    <tbody>
                        <tr>
                            <td colspan="3" style="padding-left: 5px">
                                <h1 style="font-weight: 900; font-size: 24px; margin: 0;">${ params?.subject || process.env.APP_NAME }</h1>
                            </td>
                        </tr>
                        <tr>
                            <td colspan="3">
                                <hr/>
                            </td>
                        </tr>
                        <tr>
                            <th align="center" width="10px">
                                <b style="font-size: 20px; line-height: 0;">&#9786;</b>
                            </th>
                            <th align="left" style="padding: 8px; white-space: nowrap">
                                Göndərən:
                            </th>
                            <td style="padding: 8px;">${ params.fullName },</td>
                        </tr>
                        <tr>
                            <th align="center" style="padding-top: 8px;vertical-align: top;">
                                <b>&#9993;</b>
                            </th>
                            <th align="left" style="padding: 8px;">
                                Email:
                            </th>
                            <td style="padding: 8px;">${ params.email },</td>
                        </tr>
                        <tr>
                            <th align="center" style="padding-top: 8px;vertical-align: top;">
                                <b>&#9742;</b>
                            </th>
                            <th align="left" style="padding: 8px;">
                                Telefon:
                            </th>
                            <td style="padding: 8px;">${ params.phone },</td>
                        </tr>
                        <tr>
                            <th align="center" style="padding-top: 8px; vertical-align: top;">
                                <b>&#9998;</b>
                            </th>
                            <th align="left" style="padding: 8px; vertical-align: top;">
                                Mesaj:
                            </th>
                            <td style="padding: 8px; line-height: 24px;">${ params.message }</td>
                        </tr>
                    </tbody>
                </table>`;
};

module.exports.otpCode = async (params) => {
    return `<div style="padding: 40px 20px; background: #f0f1f4; border-radius: 8px;">
                <div style="padding: 50px 30px 30px; background: #ffffff; width: 400px; max-width: 100%; margin: 0 auto; text-align: center">

                    <h2 style="font-weight: bold; font-size: 30px; margin: 0 0 20px">${params.templateTitle}</h2>

                    <p style="color: #333333; margin-bottom: 20px;">
                        Please enter this confirmation code in the window where you started creating your account:
                    </p>

                    <div style="padding: 30px; background: #f0f1f4;">
                        <h1 style="font-size: 40px; letter-spacing: 2px; text-align:center; margin: 0px">
                            ${ params.otp }
                        </h1>
                    </div>

                </div>
            </div>`;
};
