const express = require('express');
const { getUsers, getUserById } = require('../controllers/userController');
const userRoutes = express.Router();

userRoutes.get('/', getUsers);
userRoutes.get('/:id', getUserById);

module.exports = userRoutes;