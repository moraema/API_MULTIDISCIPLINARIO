const express = require('express');
const router = express.Router();
const adminController = require('../controllers/admin.controller');
const authMidleware = require('../middlewares/auth.middlewares');
const { uploadFile} = require('../service/multer/multer.service')
 
router.post('/', adminController.CreateAdmin);
router.post('/agregar-productos', authMidleware.verificarJwt, uploadFile.single('imagen'), adminController.agregarProducto);
router.get('/pedidos', authMidleware.verificarJwt, adminController.getPedidos);
router.get('/productos', authMidleware.verificarJwt, adminController.getProductosByCreator)
router.delete('/pedidos/:id', authMidleware.verificarJwt, adminController.deletePedido);
router.put('/estado/:productId', authMidleware.verificarJwt, adminController.UpdateProductStatus);
router.put('/producto/:productId',  adminController.UpdateProducto);





module.exports = router;