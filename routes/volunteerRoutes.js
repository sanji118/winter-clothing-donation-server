const express = require('express');
const { getVolunteers, getVolunteerById, deleteVolunteerData } = require('../controllers/volunteerController');
const volunteerRoutes = express.Router();

volunteerRoutes.get('/', getVolunteers);
volunteerRoutes.get('/:id', getVolunteerById);
volunteerRoutes.delete('/:id', deleteVolunteerData)

module.exports = volunteerRoutes;