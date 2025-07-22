const express = require('express');
const announcementRoutes = express.Router();
const announcementController = require('../controllers/announcementController')

announcementRoutes.get("/:id", announcementController.getById);
announcementRoutes.get("/", announcementController.getAll);
announcementRoutes.post("/", announcementController.create);
announcementRoutes.patch("/:id", announcementController.update);
announcementRoutes.delete("/:id", announcementController.remove);


module.exports = announcementRoutes;