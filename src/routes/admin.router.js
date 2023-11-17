const express = require('express');
const router = express.Router();
const adminController = require('../controllers/admin.controller');
const authMidleware = require('../middlewares/auth.middlewares');

router.get('/pedidos-pusher', authMidleware.verificarJwt, adminController.getPedidos);
router.get('/vendidos', authMidleware.verificarJwt, adminController.getVentaProduct);
router.delete('/pedidos/:id', authMidleware.verificarJwt, adminController.deletePedido);
router.post('/ventas', authMidleware.verificarJwt, adminController.saveTransaction);



module.exports = router;