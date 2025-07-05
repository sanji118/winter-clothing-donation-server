const express = require('express');
const { getGallery, getGalleryItemById } = require('../controllers/galleryController');
const galleryRoutes = express.Router();

galleryRoutes.get('/', getGallery);
galleryRoutes.get('/:id', getGalleryItemById);

module.exports = galleryRoutes;