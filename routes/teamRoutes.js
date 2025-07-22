const express = require('express');
const teamController = require('../controllers/teamController');
const teamRoutes = express.Router();

teamRoutes.get("/", teamController.getAll);
teamRoutes.get("/:id", teamController.getById);
teamRoutes.post("/", teamController.create);
teamRoutes.patch("/:id", teamController.update);
teamRoutes.delete("/:id", teamController.remove);

module.exports = teamRoutes;
