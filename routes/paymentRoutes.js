const express = require('express');
const { initiateSSLPayment } = require('../controllers/paymentController');
const paymentRouter = express.Router();
paymentRouter.post('/initiate-ssl-payment', initiateSSLPayment);
module.exports = paymentRouter;