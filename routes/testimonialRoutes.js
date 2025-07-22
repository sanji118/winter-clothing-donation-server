const express = require('express');
const testimonialController = require('../controllers/testimonialController');
const testimonialRoutes = express.Router();

testimonialRoutes.get("/", testimonialController.getAll);
testimonialRoutes.get("/:id", testimonialController.getById);
testimonialRoutes.post("/", testimonialController.create);
testimonialRoutes.patch("/:id", testimonialController.update);
testimonialRoutes.delete("/:id", testimonialController.remove);

module.exports = testimonialRoutes;
