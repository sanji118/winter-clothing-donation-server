const express = require('express');
const { getDonations, getDonationById } = require('../controllers/donationController');
const donationRoutes = express.Router();

donationRoutes.get('/', getDonations);
donationRoutes.get('/:id', getDonationById);

module.exports = donationRoutes;