const express = require('express');
const { initiateSSLPayment, sslPaymentSuccess } = require('../controllers/paymentController');
const paymentRouter = express.Router();


paymentRouter.post('/initiate-ssl-payment', initiateSSLPayment);
paymentRouter.post('/ssl-payment-success', sslPaymentSuccess);



module.exports = paymentRouter;