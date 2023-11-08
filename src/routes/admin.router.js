const express = require('express');
const router = express.Router();
const adminController = require('../controllers/admin.controller');


router.get('/ventas', adminController.getVenta);
router.get('/vendidos', adminController.getVentaProduct);


module.exports = router;