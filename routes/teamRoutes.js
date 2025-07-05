const express = require('express');
const { getTeam, getTeamMemberById } = require('../controllers/teamController');
const teamRoutes = express.Router();

teamRoutes.get('/', getTeam);
teamRoutes.get('/:id', getTeamMemberById);

module.exports = teamRoutes;