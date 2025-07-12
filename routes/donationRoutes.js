const express = require('express');
const { getDonations, getDonationById, getDonationBySlug } = require('../controllers/donationController');
const donationRoutes = express.Router();

donationRoutes.get('/', getDonations);
donationRoutes.get('/id/:id', getDonationById);
donationRoutes.get('/slug/:slug', getDonationBySlug);


module.exports = donationRoutes;