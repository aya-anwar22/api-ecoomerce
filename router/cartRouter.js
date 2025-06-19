const express = require('express');
const router = express.Router();
const authentication = require('../middleWare/authentcation')
const cartController = require('../controllers/cartController');
router.post('/',authentication,  cartController.addCart);
router.get('/',authentication,  cartController.getCart);
router.put('/',authentication,  cartController.updateCart);
router.delete('/',authentication,  cartController.removeCart);


module.exports = router;
