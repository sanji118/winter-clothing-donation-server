const SSLCommerz = require('sslcommerz-lts');
const { getCollection } = require('../utils/connectDB');


const store_id = process.env.SSLC_STORE_ID;
const store_password = process.env.SSLC_STORE_PASSWORD;

const is_live = false;

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
        success_url: `${process.env.BASE_URL}/ssl-payment-success?tranId=${transactionId}`,
        fail_url: `${process.env.BASE_URL}/ssl-payment-fail`,
        cancel_url: `${process.env.BASE_URL}/ssl-payment-cancel`,
        ipn_url: `${process.env.BASE_URL}/ssl-ipn`,
        emi_option: 1,
        emi_max_inst_option: 12,
        emi_selected_inst: 0,
        mult_card_name: 'all',
        allowed_bin: 'all',
        enableMobileBanking : true,
        enableInternetBanking: true,
        enableOtherCards: true,

        cus_add1: 'N/A',
        cus_city: 'N/A',
        cus_postcode: '1000',
        shipping_method: 'NO',
        ship_name: name,
        ship_add1: 'N/A',
        shipt_city: 'N/A',
        value_a: campaignSlug,
        value_b: userId,
        value_c: 'donation',
        ship_postcode: '1000',
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
        res.json( { url: response.GatewayPageURL, transactionId});
    } catch (error) {
        console.error('SSLCommerz init error: ', error);
        res.status(500).json({ message: 'Payment initiation failed' });
    }
};


exports.sslPaymentSuccess = async (req, res) => {
    const  tranId  = req.body.tran_id || req.query.tranId;
    const {
        campaignSlug,
        cus_name,
        cus_email,
        amount,
        value_b,
        val_id,
        bank_tran_id
    } = req.body;
    const donation = {
        campaignSlug : campaignSlug || req.query.campaignSlug ,
        name: cus_name,
        email: cus_email,
        userId: value_b || req.query.userId,
        amount: Number(amount),
        method: 'SSLCommerz',
        transactionId: tranId,
        paymentstatus: 'success',
        date: new Date(),
        val_id: val_id,
        bank_tran_id: bank_tran_id
    };

    try {
        const collection = await getCollection('donations');
        await collection.insertOne(donation);
        res.redirect(`${process.env.CLIENT_URL}/payment-success?tranId=${tranId}`);

    } catch (error) {
        console.error('Error saving donation: ', error);
        res.redirect(`${process.env.CLIENT_URL}/payment-success?status=failed`);
    }
}

exports.sslIPN = async (req, res) => {
    const { val_id , status, tran_id} = req.body;

    try {
        const collection = await getCollection('donations');
        await collection.updateOne(
            { transactionId: tran_id},
            {
                $set: {
                    val_id: val_id,
                    verified: status === 'VALID',
                    verification_date : new Date(),
                    paymentstatus: status === 'VALID' ? 'verified' : 'failed'
                }
            }
        );
        res.status(200).json( { status: 'VALIDATED'});
    } catch (error) {
        console.error('IPN validation error: ', error);
        res.status(500).json({ status: 'FAILED'})
    }
}

exports.checkPaymentStatus = async (req, res) => {
    try {
        const collection = await getCollection('donations');
        const donation = await collection.findOne({
            transactionId: req.params.tranId
        });

        if (!donation) {
            return res.status(404).json({ error: 'Transaction not found.' })
        };
        res.json({
            status: donation.paymentstatus,
            verified: donation.verified,
            transactionId: donation.transactionId,
            amount: donation.amount
        });

    } catch (error) {
        res.status(500).json( { error: error.message })
    }
}