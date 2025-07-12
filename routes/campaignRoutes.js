const express = require('express');
const { getCampaigns, getCampaignById, getCampaignBySlug, postCommentToCampaign } = require('../controllers/campaignController');
const campaignRoutes = express.Router();

campaignRoutes.get('/', getCampaigns);
campaignRoutes.get('/id/:id', getCampaignById);
campaignRoutes.get('/slug/:slug', getCampaignBySlug);
campaignRoutes.post('/:id/comments', postCommentToCampaign);

module.exports = campaignRoutes;