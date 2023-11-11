const express = require('express');
const router = express.Router();
const authControllerAdmin = require('../controllers/auth.admin');
const authControllerCliente = require('../controllers/auth.clientes');


router.post('/login-cliente', authControllerCliente.loginCliente);


router.post('/login-admin', authControllerAdmin.loginAdmin);

module.exports = router;