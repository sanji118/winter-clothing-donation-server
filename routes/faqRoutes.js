const express = require('express');
const { getFaqs, getFaqById, getFaqBySlug } = require('../controllers/faqController');
const faqRoutes = express.Router();

faqRoutes.get('/', getFaqs);
faqRoutes.get('/:id', getFaqById);
faqRoutes.get('/:slug', getFaqBySlug);

module.exports = faqRoutes;