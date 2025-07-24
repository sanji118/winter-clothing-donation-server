const express = require('express');
const donationController = require('../controllers/donationController');

const donationRoutes = express.Router();


// Extra Route
donationRoutes.get('/slug/:slug', donationController.getDonationBySlug);


// Basic CRUD
donationRoutes.get('/', donationController.getAll);
donationRoutes.get('/:id', donationController.getById);
donationRoutes.post('/', donationController.create);  // custom postDonation
donationRoutes.patch('/:id', donationController.update);
donationRoutes.delete('/:id', donationController.remove);


module.exports = donationRoutes;
