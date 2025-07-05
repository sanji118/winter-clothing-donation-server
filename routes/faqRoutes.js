const express = require('express');
const { getFaqs, getFaqById } = require('../controllers/faqController');
const faqRouter = express.Router();

faqRouter.get('/', getFaqs);
faqRouter.get('/:id', getFaqById);

module.exports = faqRouter;