const Brand = require('../models/Brand');
const asyncHandler = require('express-async-handler');
const Subcategory = require('../models/Subcategory');
const Product = require('../models/Product');
const Cart = require('../models/Cart');
///  user
// add cart
exports.addCart = asyncHandler(async(req, res) =>{
    const userId = req.user._id;
    const {productId, quntity} = req.body;
    if(!productId){
        return res.status(400).json({
            message: "Ptoduct is required"
        })
    }


    const product = await Product.findById(productId);
    if(!product){
        return res.status(404).json({
            message: "Product not found"
        })
    }

    const originalPrice = product.price;
    const currentPrice = product.price;

    let cart = await Cart.findOne({ userId})


    if(!cart){
        cart = new Cart({
            userId,
            items:[{
                productId,
                quntity,
                addedAt: new Date(),
                originalPrice,
                currentPrice


            }]
        })
    } else{

        const existingProduct = cart.items.findIndex(item =>
            item.productId.toString() === productId
        );

        if(existingProduct > -1){

            cart.items[existingProduct].quntity += quntity;
            cart.items[existingProduct].addedAt = new Date();
            cart.items[existingProduct].originalPrice = originalPrice;
            cart.items[existingProduct].currentPrice = currentPrice;

        } else {
            cart.items.push({
                productId,
                quntity,
                addedAt :new Date(),
                originalPrice,
                currentPrice
            })
        }

    }

    await cart.save();
    res.status(200).json({
        message: "Product add successfully"
    })

})


// get cart

exports.getCart = asyncHandler(async(req, res) =>{
    const userId = req.user._id;

const cart = await Cart.findOne({ userId }).populate('items.productId')
    if(!cart || !cart.items || cart.items.length === 0){
        return res.status(200).json({
            vaildItems : [],
            outItems: []
        })

    }
    const vaildItems = [];
    const outItems = [];


    for(const item of cart.items){
        const product = item.productId;

        if(!product) continue;

        const lastPrice = product.price;

        if(item.currentPrice !== lastPrice){
            outItems.push({
                 productId: product,
                quntity: item.quntity,
                addedAt: item.addedAt,
                originalPrice: item.currentPrice,
                currentPrice: lastPrice,
                notes: 'price is change'
            })

        } else{
            vaildItems.push({
                 productId: product,
                quntity: item.quntity,
                addedAt: item.addedAt,
                originalPrice: item.originalPrice,
                currentPrice: item.currentPrice,
            })
        }
    }
    res.status(200).json({
        vaildItems, outItems
    })

    
})
// update cart
exports.updateCart = asyncHandler(async(req, res) =>{
    const userId = req.user._id;
    const {productId, quntity} = req.body;
    if(!productId || quntity == null || quntity < 1){
        return re.status(400).json({
            message: "Product idand vaild quintity are required"
        })
    }
    const cart = await Cart.findOne({userId})

    if(!cart){
        return res.status(404).json({
            message: "Cart not found"
        })
    }

    const itemIndex = cart.items.findIndex(item =>
        item.productId.toString() === productId
    )

    if(itemIndex === -1){
        return res.status(404).json({
            messsage: "Product not found in cart"
        })
    }

    cart.items[itemIndex].quantity = quntity;
    cart.items[itemIndex].addedAt = new Date();

    await cart.save();
    res.status(200).json({
        message: "cart update successfully"
    })


})


// remove

exports.removeCart = asyncHandler(async(req, res) =>{
     const userId = req.user._id;
    const {productId} = req.body;

    if(!productId ){
        return re.status(400).json({
            message: "Product id is required"
        })
    }

    const cart = await Cart.findOne({userId})

    if(!cart){
        return res.status(404).json({
            message: "Cart not found"
        })
    }


    const itemIndex = cart.items.findIndex(item =>
        item.productId.toString() === productId
    )

    if(itemIndex === -1){
        return res.status(404).json({
            messsage: "Product not found in cart"
        })
    }


    cart.items.splice(itemIndex,1)
    await cart.save();
    res.status(200).json({
        message: "produt remove"
    })


})