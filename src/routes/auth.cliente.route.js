const express = require('express');
const router = express.Router();
const authController = require('../controllers/auth.clientes');

router.post('/login-cliente', authController.login);

module.exports = router;