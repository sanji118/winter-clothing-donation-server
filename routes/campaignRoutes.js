const express = require('express');
const { getCampaigns, getCampaignById } = require('../controllers/campaignController');
const campaignRoutes = express.Router();

campaignRoutes.get('/', getCampaigns);
campaignRoutes.get('/:id', getCampaignById);

module.exports = campaignRoutes;