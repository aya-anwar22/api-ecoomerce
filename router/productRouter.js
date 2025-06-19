const express = require('express');
const router = express.Router();
const productController = require('../controllers/productController');
const authentication = require('../middleWare/authentcation')
const upload = require('../config/multerConfig')
router.get('/user/:productId',  productController.getProductByIdByUser);
router.get('/user',  productController.getAllProductsByUser);

router.post('/',authentication, upload.single('productImages'), productController.addProduct);
router.get('/',authentication,  productController.getAllProducts);

router.get('/:productId',authentication,  productController.getProductById);
router.put('/:productId',authentication, upload.single('productImages'), productController.updateProduct);
router.delete('/:productId',authentication, productController.deleteProduct);

module.exports = router;