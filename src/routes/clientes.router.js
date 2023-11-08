const express = require('express');
const router = express.Router();
const usuariosController = require('../controllers/clientes.controller');



router.get('/productos', usuariosController.getProduct);
router.post('/crear-clientes', usuariosController.CreateClient);
router.post('/pagos', usuariosController.payments);


module.exports = router;