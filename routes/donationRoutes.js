const express = require('express');
const { getDonations, getDonationById, getDonationBySlug } = require('../controllers/donationController');
const donationRoutes = express.Router();

donationRoutes.get('/', getDonations);
donationRoutes.get('/:id', getDonationById);
donationRoutes.get('/:slug', getDonationBySlug);


module.exports = donationRoutes;