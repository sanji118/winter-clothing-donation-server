const express = require('express');
const { getGallery, getGalleryItemById, getGalleryBySlug } = require('../controllers/galleryController');
const galleryRoutes = express.Router();

galleryRoutes.get('/', getGallery);
galleryRoutes.get('/:id', getGalleryItemById);
galleryRoutes.get('/:slug', getGalleryBySlug);

module.exports = galleryRoutes;