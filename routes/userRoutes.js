const express = require('express');
const { getUsers, getUserById, createUser, updateUserRole } = require('../controllers/userController');
const { verifyToken, verifyRole } = require('../controllers/authController');
const userRoutes = express.Router();

userRoutes.post('/', createUser);
userRoutes.patch('/:id/role', verifyToken, verifyRole, updateUserRole);
userRoutes.get('/', getUsers);
userRoutes.get('/:id', getUserById);

module.exports = userRoutes;