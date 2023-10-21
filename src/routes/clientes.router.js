const express = require('express');
const router = express.Router();
const usuariosController = require('../controllers/clientes.controller');

router.get('/administrador', usuariosController.getAdmin);
router.get('/productos', usuariosController.getProduct);


module.exports = router;