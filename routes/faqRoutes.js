const express = require('express');
const faqController = require('../controllers/faqController');
const faqRoutes = express.Router();

faqRoutes.get("/", faqController.getAll);
faqRoutes.get("/:id", faqController.getById);
faqRoutes.post("/", faqController.create);
faqRoutes.patch("/:id", faqController.update);
faqRoutes.delete("/:id", faqController.remove);
faqRoutes.get('/slug/:slug', faqController.getFaqBySlug);

module.exports = faqRoutes;