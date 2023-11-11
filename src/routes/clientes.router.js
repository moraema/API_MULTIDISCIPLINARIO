const express = require('express');
const router = express.Router();
const usuariosController = require('../controllers/clientes.controller');
const authMidleware = require('../middlewares/auth.middlewares');


router.get('/productos', usuariosController.getProduct);
router.post('/crear-clientes', usuariosController.CreateClient);
router.post('/pagos', authMidleware.verificarJwt, usuariosController.pagos);
router.get('/cliente', authMidleware.verificarJwt, usuariosController.getCliente);
router.put('/actualizar-cliente', authMidleware.verificarJwt, usuariosController.updateubicacion);
router.post('/pedidos', authMidleware.verificarJwt, usuariosController.CreatePedido);



module.exports = router;