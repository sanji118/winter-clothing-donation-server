const express = require('express');
const { getAnnouncements, getAnnouncementById } = require('../controllers/announcementController');
const announcementRoutes = express.Router();

announcementRoutes.get('/', getAnnouncements);
announcementRoutes.get('/:id', getAnnouncementById);

module.exports = announcementRoutes;