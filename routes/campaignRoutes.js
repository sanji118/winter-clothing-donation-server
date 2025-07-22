const express = require('express');
const campaignController = require('../controllers/campaignController');
const campaignRoutes = express.Router();

campaignRoutes.get("/", campaignController.getAll);
campaignRoutes.get("/:id", campaignController.getById);
campaignRoutes.post("/", campaignController.create);
campaignRoutes.patch("/:id", campaignController.update);
campaignRoutes.delete("/:id", campaignController.remove);

// Extra routes
campaignRoutes.get('/slug/:slug', campaignController.getCampaignBySlug);
campaignRoutes.post('/:id/comments', campaignController.postCommentToCampaign);

module.exports = campaignRoutes;
