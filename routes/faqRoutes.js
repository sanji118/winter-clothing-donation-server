const express = require('express');
const { getFaqs, getFaqById } = require('../controllers/faqController');
const faqRoutes = express.Router();

faqRoutes.get('/', getFaqs);
faqRoutes.get('/:id', getFaqById);

module.exports = faqRoutes;