const express = require('express');
const { login, logout, verifyToken, verifyRole } = require('../controllers/authController');
const authRoutes = express.Router();

authRoutes.post('/jwt', login);
authRoutes.post('/logout', logout);
authRoutes.get('/admin/dashboard', verifyToken, verifyRole(['admin']), (req, res) => {
    res.send({ success: true, message: 'Welcome Admin! '})
})
authRoutes.get('/volunteer/dashboard', verifyToken, verifyRole(['volunteer']), (req, res) => {
    res.send({ success: true, message: 'Welcome Volunteer! '})
})


module.exports = authRoutes;
