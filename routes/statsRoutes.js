const express = require('express');
const { getAdminStats } = require('../controllers/statsController');
const StatsRouter = express.Router();

StatsRouter.get('/', getAdminStats);

module.exports = StatsRouter;
