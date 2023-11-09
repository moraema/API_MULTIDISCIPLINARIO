const express = require('express');
const router = express.Router();
const adminController = require('../controllers/admin.controller');


router.get('/ventas', adminController.getPedidos);
router.get('/vendidos', adminController.getVentaProduct);
router.post('/ventas', adminController.insertVenta);
router.post('/ventas-productos', adminController.productoVenta);
router.delete('/pedidos/:id', adminController.deletePedido);


module.exports = router;