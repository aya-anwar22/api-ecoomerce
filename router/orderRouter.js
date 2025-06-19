const express = require('express');
const router = express.Router();
const authentication = require('../middleWare/authentcation')
const ordersController = require('../controllers/ordersController');


//////////////////////for admin ///////////////
router.get('/orders', authentication, ordersController.getAllOrders);
router.patch("/orders/:orderId", authentication, ordersController.updateOrderStatus);

router.post('/',authentication,  ordersController.createOrder);
router.get('/:orderId', authentication, ordersController.getOrderById);
router.get('/', authentication, ordersController.getOrders);
router.patch('/:orderId', authentication, ordersController.requestReturn);
router.patch('/:orderId/cancel', authentication, ordersController.cancelOrder);



module.exports = router;
