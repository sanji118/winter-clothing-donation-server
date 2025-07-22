const express = require('express');
const { getTestimonials, getTestimonialById, deleteTestimonialData } = require('../controllers/testimonialController');
const testimonialRoutes = express.Router();

testimonialRoutes.get('/', getTestimonials);
testimonialRoutes.get('/:id', getTestimonialById);
testimonialRoutes.delete('/:id', deleteTestimonialData)

module.exports = testimonialRoutes;
