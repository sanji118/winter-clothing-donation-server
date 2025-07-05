const express = require('express');
const { getVolunteers, getVolunteerById } = require('../controllers/volunteerController');
const volunteerRoutes = express.Router();

volunteerRoutes.get('/', getVolunteers);
volunteerRoutes.get('/:id', getVolunteerById);

module.exports = volunteerRoutes;