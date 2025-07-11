const express = require('express');
const { getCampaigns, getCampaignById, getCampaignBySlug } = require('../controllers/campaignController');
const campaignRoutes = express.Router();

campaignRoutes.get('/', getCampaigns);
campaignRoutes.get('/:id', getCampaignById);
campaignRoutes.get('/:slug', getCampaignBySlug);

module.exports = campaignRoutes;