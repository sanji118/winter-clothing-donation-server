const express = require('express');
const { getGallery, getGalleryItemById, getGalleryBySlug } = require('../controllers/galleryController');
const galleryRoutes = express.Router();

galleryRoutes.get('/', getGallery);
galleryRoutes.get('/id/:id', getGalleryItemById);
galleryRoutes.get('/slug/:slug', getGalleryBySlug);

module.exports = galleryRoutes;