const express = require('express');
const router = express.Router();
const adminController = require('../controllers/admin.controller');
const authMidleware = require('../middlewares/auth.middlewares');

router.get('/pedidos', authMidleware.verificarJwt, adminController.getPedidos);
router.get('/vendidos', authMidleware.verificarJwt, adminController.getVentaProduct);
router.post('/ventas', authMidleware.verificarJwt, adminController.insertVenta);
router.post('/ventas-productos', authMidleware.verificarJwt, adminController.productoVenta);
router.delete('/pedidos/:id', authMidleware.verificarJwt, adminController.deletePedido);



module.exports = router;