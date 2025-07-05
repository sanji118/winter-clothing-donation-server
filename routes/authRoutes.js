const express = require('express');
const { login, logout } = require('../controllers/authController');
const authRoutes = express.Router();

authRoutes.post('/jwt', login);
authRoutes.post('/logout', logout);

module.exports = authRoutes;
