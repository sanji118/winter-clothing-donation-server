const express = require('express');
const { login, logout, verifyToken, verifyRole, getMe, checkRole } = require('../controllers/authController');
const authRoutes = express.Router();

authRoutes.post('/jwt', login);
authRoutes.get('/check-role/:role', verifyToken, checkRole);
authRoutes.post('/logout', logout);
authRoutes.get('/admin/dashboard', verifyToken, verifyRole(['admin']), (req, res) => {
    res.send({ success: true, message: 'Welcome Admin! '})
})
authRoutes.get('/volunteer/dashboard', verifyToken, verifyRole(['volunteer']), (req, res) => {
    res.send({ success: true, message: 'Welcome Volunteer! '})
})
authRoutes.get('/partner/dashboard', verifyToken, verifyRole(['partner']), (req, res) => {
    res.send({ success: true, message: 'Welcome Partner! '})
})

authRoutes.get('/user/dashboard', verifyToken, verifyRole(['user']), (req, res) => {
    res.send({ success: true, message: 'Welcome User Dashboard!' });
});

authRoutes.get('/me', verifyToken, getMe);
module.exports = authRoutes;
