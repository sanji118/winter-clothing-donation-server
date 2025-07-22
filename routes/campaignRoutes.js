const express = require('express');
const { getCampaigns, getCampaignById, getCampaignBySlug, postCommentToCampaign, deleteCampaignData, createCampaign, updateCampaign } = require('../controllers/campaignController');
const campaignRoutes = express.Router();

campaignRoutes.get('/', getCampaigns);
campaignRoutes.get('/id/:id', getCampaignById);
campaignRoutes.get('/slug/:slug', getCampaignBySlug);
campaignRoutes.post('/:id/comments', postCommentToCampaign);
campaignRoutes.post("/", createCampaign);
campaignRoutes.patch("/:id", updateCampaign);
campaignRoutes.delete('/:id', deleteCampaignData)

module.exports = campaignRoutes;