const express = require('express');
const { getUsers, getUserById, createUser } = require('../controllers/userController');
const userRoutes = express.Router();

userRoutes.post('/', createUser);
userRoutes.get('/', getUsers);
userRoutes.get('/:id', getUserById);

module.exports = userRoutes;