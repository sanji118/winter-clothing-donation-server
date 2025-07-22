const express = require('express');
const galleryController = require('../controllers/galleryController');
const galleryRoutes = express.Router();

galleryRoutes.get("/", galleryController.getAll);
galleryRoutes.get("/:id", galleryController.getById);
galleryRoutes.get("/slug/:slug", galleryController.getGalleryBySlug);
galleryRoutes.post("/", galleryController.create);
galleryRoutes.patch("/:id", galleryController.update);
galleryRoutes.delete("/:id", galleryController.remove);

module.exports = galleryRoutes;
