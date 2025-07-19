const SSLCommerz = require('sslcommerz-lts');
const { getCollection } = require('../utils/connectDB');

const store_id = process.env.SSLC_STORE_ID;
const store_password = process.env.SSLC_STORE_PASSWORD;
const is_live = false;


exports.initiateSSLPayment = async (req, res) => {
    const { amount, name, email, phone, campaignSlug , isAnonymous, userId} = req.body;

    
    if (!amount || !campaignSlug) {
        return res.status(400).json({ message: 'Amount and Campaign are required.' });
    }

    if (!isAnonymous) {
        if(!name || !email || !phone) {
            return res.status(400).json({ message: 'Name, email and phone are required for non-anonymous donations.' })
        }
    }

    const transactionId = `TXN-${Date.now()}`;

    const data = {
        total_amount: Number(amount),
        currency: 'BDT',
        tran_id: transactionId,
        success_url: `${process.env.BASE_URL}/payment/ssl-payment-success?tranId=${transactionId}`,
        fail_url: `${process.env.BASE_URL}/payment/ssl-payment-fail`,
        cancel_url: `${process.env.BASE_URL}/payment/ssl-payment-cancel`,
        ipn_url: `${process.env.BASE_URL}/payment/ssl-ipn`,
        emi_option: 1,
        emi_max_inst_option: 12,
        emi_selected_inst: 0,
        mult_card_name: 'all',
        allowed_bin: 'all',
        enableMobileBanking: true,
        enableInternetBanking: true,
        enableOtherCards: true,

        // customer details
        cus_add1: 'N/A',
        cus_city: 'N/A',
        cus_postcode: '1000',
        shipping_method: 'NO',
        ship_name: name,
        ship_add1: 'N/A',
        shipt_city: 'N/A',
        ship_postcode: '1000',
        ship_country: 'Bangladesh',

        cus_name: isAnonymous? 'Anonymous Donor' : name,
        cus_email:isAnonymous? 'anonymous@cozykindeness.com' : email,
        cus_phone: isAnonymous? '01XXXXXXXXX' : phone,

        product_name: 'Donation',
        product_category: 'Donation',
        product_profile: 'general',

        // Pass campaign and user info
        value_a: campaignSlug,
        value_b: isAnonymous ? 'true' : 'false',
        value_c: 'donation',
        value_d: userId
    };

    try {
        const donations = await getCollection('donations');
        await donations.insertOne({
            transactionId,
            userId: userId || null,
            isGuest: !userId,
            campaignSlug,
            name: isAnonymous ? 'Anonymous Donor' : name,
            email: isAnonymous ? null : email,
            phone: isAnonymous ? null : phone,
            amount: Number(amount),
            isAnonymous,
            paymentstatus: 'initiated',
            date: new Date(),
        });
    } catch (err) {
        console.error('Error saving pending donation:', err);
        return res.status(500).json({ message: 'Could not start donation.' });
    }

    try {
        const sslcz = new SSLCommerz(store_id, store_password, is_live);
        const response = await sslcz.init(data);
        res.json({ url: response.GatewayPageURL, transactionId });
    } catch (error) {
        console.error('SSLCommerz init error: ', error);
        res.status(500).json({ message: 'Payment initiation failed' });
    }
};


exports.sslPaymentSuccess = async (req, res) => {
    const tranId = req.query?.tranId;


    console.log('success: ' , req.body);
    const {
        value_a: campaignSlug,
        value_b,
        value_d: userId,
        amount,
        val_id,
        bank_tran_id,
        card_issuer,
        card_brand
    } = req.body;

    console.log('Query : ', req.query)
    
    
    try {
        const collection = await getCollection('donations');

        const originalDonation = await collection.findOne({
            transactionId: tranId
        })

        if (!originalDonation) {
            throw new Error('Original donation record not found.')
        }
        const isAnonymous = value_b === 'true';
        const method = card_brand === 'MOBILEBANKING' ? card_issuer : `${card_issuer} via ${card_brand} card`;

        

        const donation = {
            campaignSlug,
            name: isAnonymous ? 'Anonymous Donor' : originalDonation.name,
            email: isAnonymous ? 'anonymous@cozykindness.com' : originalDonation.email,
            phone: isAnonymous ? '01XXXXXXXXX' : originalDonation.phone,
            userId: originalDonation.userId,
            isGuest: !originalDonation.userId,
            amount: Number(amount),
            method: method,
            transactionId: tranId,
            paymentstatus: 'success',
            date: new Date(),
            bank_tran_id: bank_tran_id,
            isAnonymous: isAnonymous,
            verified: req.body?.status === 'VALID'
        };
        if (req.body?.status === 'VALID') {
            donation.verified = true;
            donation.verification_date = new Date();
        }
        console.log("FINAL donation : ", donation);


        await collection.updateOne(
            {transactionId: tranId},
            {$set: donation}
        );


        res.redirect(`${process.env.CLIENT_URL}/payment/payment-success?tranId=${tranId}`);
    } catch (error) {
        console.error('Error saving donation: ', error);
        res.redirect(`${process.env.CLIENT_URL}/payment/payment-success?status=failed`);
    }
};


exports.sslIPN = async (req, res) => {
    const { val_id, status, tran_id , bank_tran_id} = req.body;

    try {
        const collection = await getCollection('donations');
        if (bank_tran_id) {
            updateData.bank_tran_id = bank_tran_id;
        }
        await collection.updateOne(
            { transactionId: tran_id },
            {
                $set: {
                    val_id: val_id,
                    verified: status === 'VALID',
                    verification_date: new Date(),
                    paymentstatus: status === 'VALID' ? 'verified' : 'failed'
                }
            }
        );
        res.status(200).json({ status: 'VALIDATED' });
    } catch (error) {
        console.error('IPN validation error: ', error);
        res.status(500).json({ status: 'FAILED' });
    }
};


exports.checkPaymentStatus = async (req, res) => {
    try {
        const collection = await getCollection('donations');
        const donation = await collection.findOne({
            transactionId: req.params.tranId
        });

        if (!donation) {
            return res.status(404).json({ error: 'Transaction not found.' });
        }

        res.json({
            status: donation.paymentstatus,
            verified: donation.verified,
            transactionId: donation.transactionId,
            amount: donation.amount
        });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};
