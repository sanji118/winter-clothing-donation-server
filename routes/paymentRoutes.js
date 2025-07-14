const express = require('express');
const { initiateSSLPayment, sslPaymentSuccess, sslIPN, checkPaymentStatus } = require('../controllers/paymentController');
const paymentRouter = express.Router();


paymentRouter.post('/initiate-ssl-payment', initiateSSLPayment);
paymentRouter.post('/ssl-payment-success', sslPaymentSuccess);
paymentRouter.post('/ssl-payment-fail', (req, res) => {
  console.warn('SSL Payment failed:', req.body);
  res.redirect(`${process.env.CLIENT_URL}/payment-failed`);
});

paymentRouter.post('/ssl-payment-cancel', (req, res) => {
  console.warn('SSL Payment cancelled by user:', req.body);
  res.redirect(`${process.env.CLIENT_URL}/payment-cancelled`);
});

paymentRouter.post('/ssl-ipn', sslIPN);
paymentRouter.get('/payment-status/:tranId', checkPaymentStatus);

module.exports = paymentRouter;