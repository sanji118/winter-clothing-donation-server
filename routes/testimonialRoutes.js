const express = require('express');
const { getTestimonials, getTestimonialById } = require('../controllers/testimonialController');
const testimonialRoutes = express.Router();

testimonialRoutes.get('/', getTestimonials);
testimonialRoutes.get('/:id', getTestimonialById);

module.exports = testimonialRoutes;
