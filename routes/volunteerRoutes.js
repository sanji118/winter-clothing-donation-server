const express = require('express');
const volunteerController = require('../controllers/volunteerController');
const volunteerRoutes = express.Router();

volunteerRoutes.get("/", volunteerController.getAll);
volunteerRoutes.get("/:id", volunteerController.getById);
volunteerRoutes.post("/", volunteerController.create);
volunteerRoutes.patch("/:id", volunteerController.update);
volunteerRoutes.delete("/:id", volunteerController.remove);

module.exports = volunteerRoutes;
