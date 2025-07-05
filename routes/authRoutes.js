const express = require('express');
const { login, logout } = require('../controllers/authController');
const router = express.Router();

router.post('/jwt', login);
router.post('/logout', logout);

module.exports = router;
