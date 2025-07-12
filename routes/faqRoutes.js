const express = require('express');
const { getFaqs, getFaqById, getFaqBySlug } = require('../controllers/faqController');
const faqRoutes = express.Router();

faqRoutes.get('/', getFaqs);
faqRoutes.get('/id/:id', getFaqById);
faqRoutes.get('/slug/:slug', getFaqBySlug);

module.exports = faqRoutes;