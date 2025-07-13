const SSLCommerz = require('sslcommerz-lts');


const store_id = process.env.SSLC_STORE_ID;
const store_password = process.env.SSLC_STORE_PASSWORD;

const is_live = true;

exports.initiateSSLPayment = async (req, res) => {
    const { amount , name, email, phone, campaignSlug, userId } = req.body;

    if( !amount || !name || !email || !phone || !campaignSlug || !userId) {
        return res.status(400).json( { message: 'Missing required fields.' });
    }

    const transactionId = `TXN-${Date.now()}`;

    const data = {
        total_amount : Number(amount),
        currency: 'BDT',
        tran_id: transactionId,
        success_url: `${process.env.BASE_URL}/api/ssl-payment-success?tranId=${transactionId}`,
        fail_url: `${process.env.BASE_URL}/api/ssl-payment-fail`,
        cancel_url: `${process.env.BASE_URL}/api/ssl-payment-cancel`,
        cus_name: name,
        cus_email: email,
        cus_phone: phone,
        product_name: 'Donation',
        product_category: 'Donation',
        product_profile: 'general',
        ship_country: 'Bangladesh',
    };

    try {
        const sslcz = new SSLCommerz(store_id, store_password, is_live);
        const response = await sslcz.init(data);
        res.json( { url: response.GatewayPageUrl, transactionId});
    } catch (error) {
        console.error('SSLCommerz init error: ', error);
        res.status(500).json({ message: 'Payment initiation failed' });
    }
};