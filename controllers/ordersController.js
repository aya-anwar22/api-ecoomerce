const Brand = require('../models/Brand');
const asyncHandler = require('express-async-handler');
const Subcategory = require('../models/Subcategory');
const Product = require('../models/Product');
const Cart = require('../models/Cart');
const Order = require('../models/Order')
const User = require('../models/User')
////////////// for user ///////////////////

exports.createOrder = asyncHandler(async(req, res) =>{
    const userId = req.user._id;
    const {addressId } = req.body;
    if(!addressId){
        return res.status(400).json({
            message: "Adress required"
        })
    }


    const user = await User.findById(userId)
    if(!user){
        return res.status(404).json({
            message: "User not found"
        })
    }

    const cart = await Cart.findOne({userId}).populate('items.productId')
    if(!cart || cart.items.length === 0){
        return res.status(400).json({message: 'cart empty'})
    }
  

    const selectedAdress = user.addresses.find(
        (addr) => addr._id.toString() === addressId
    )

    if(!selectedAdress){
        return res.status(404).json({
            message: "adress not found"
        })
    }


    const orderItems = cart.items.map((item) => ({
        productId : item.productId._id,
        quantity: item.quantity,
        priceAtOrderTime : item.currentPrice,
    }))


    const newOrder = new Order({
        userId,
        items:orderItems,
        address: {
            label: selectedAdress.label,
            details: selectedAdress.details
        },
        status:'preparing',
        paymentMethod:'cash',
        placedAt: new Date()
    })
    await newOrder.save();
    cart.items=[]
    await cart.save();

    res.status(201).json({
        message: "Order Done",
        newOrder
    })
});


exports.getOrderById = asyncHandler(async (req, res) => {
  const orderId = req.params.orderId;
  const userId = req.user._id;
  const userRole = req.user.role;

  const order = await Order.findById(orderId)
    .populate('items.productId', 'productName price imageUrl') 
    .populate('userId', 'userName email');

  if (!order) {
    return res.status(404).json({ message: 'Order not found' });
  }

  if (userRole !== 'admin' && order.userId._id.toString() !== userId.toString()) {
    return res.status(403).json({ message: 'Access denied' });
  }

  res.status(200).json({ order });
});



exports.getOrders = asyncHandler(async(req, res) =>{
  const userId = req.user._id;

    const orders = await Order.find({ userId })
    .populate('items.productId', 'productName price imageUrl') 
    .populate('userId', 'userName email');

  if (!orders) {
    return res.status(404).json({ message: 'Order not found' });
  }
  res.status(200).json(orders);
})


exports.requestReturn = asyncHandler(async(req, res) =>{
  const orderId = req.params.orderId;
  const userId = req.user._id;
  const order = await Order.findById(orderId);
  if(!order){
    return res.status(404).json({message: "order not found"})
  }
   if (order.userId.toString() !== userId.toString()) {
    return res.status(403).json({ message: "Access denied" });
  }

  if (order.status !== "delivered") {
    return res.status(400).json({ message: "You can only return a delivered order" });
  }
  const now = new Date();
  if (now > order.returnDeadline) {
    return res.status(400).json({ message: "Return period expired" });
  }

  order.returnRequested = true;
  await order.save();

  res.status(200).json({ message: "Return request submitted" });
});



exports.cancelOrder = asyncHandler(async (req, res) => {
  const orderId = req.params.orderId;
  const userId = req.user._id;

  const order = await Order.findById(orderId);

  if (!order) {
    return res.status(404).json({ message: "Order not found" });
  }

  if (order.userId.toString() !== userId.toString()) {
    return res.status(403).json({ message: "Access denied" });
  }

  if (order.status !== "preparing") {
    return res.status(400).json({ message: "Order can only be cancelled while preparing" });
  }

  order.cancellation = {
    isCancelled: true,
    cancelledBy: userId,
    cancelledAt: new Date()
  };

  order.status = "cancelled";
  await order.save();

  res.status(200).json({ message: "Order cancelled successfully" });
});





//////////////////// for admin ///////////////////////////
exports.getAllOrders = asyncHandler(async (req, res) => {
  const { status, userId, isPaid, fromDate, toDate } = req.query;

  let filter = {};

  if (status) filter.status = status;
  if (userId) filter.userId = userId;
  if (isPaid) filter.isPaid = isPaid === "true";

  if (fromDate || toDate) {
    filter.createdAt = {};
    if (fromDate) filter.createdAt.$gte = new Date(fromDate);
    if (toDate) filter.createdAt.$lte = new Date(toDate);
  }

  const orders = await Order.find(filter)
    .populate("userId", "userName email")
    .sort({ createdAt: -1 });

  res.status(200).json({ count: orders.length, orders });
});





exports.updateOrderStatus = asyncHandler(async (req, res) => {
    const isAdmin = req.user && req.user.role === "admin";
    if(!isAdmin){
        return res.status(403).json({
            message: "Acess, denied... Admin only"
        })
    }

  const { status } = req.body;

  const order = await Order.findById(req.params.orderId);
  if (!order) {
    return res.status(404).json({ message: "Order not found" });
  }

  order.status = status;

  if (status === "delivered") {
    order.deliveredAt = new Date();
  }

  await order.save();

  res.status(200).json({ message: "Order status updated", order });
});

