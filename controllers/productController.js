const Brand = require('../models/Brand');
const slugify = require('slugify');
const asyncHandler = require('express-async-handler');
const Subcategory = require('../models/Subcategory');
const Product = require('../models/Product');
const cloudinary  = require('../config/cloudinary')
/// for admin

exports.addProduct = asyncHandler(async(req, res) => {


    const {productName, description,brandId, subcategoryId, price,quantity,gender,stockAlertThreshold } = req.body;
    const isAdmin = req.user && req.user.role === "admin";
    if(!isAdmin){
        return res.status(403).json({
            message: "Acess, denied... Admin only"
        })
    }

    const subCategory = await Subcategory.findById(subcategoryId)
    if(!subCategory){
        return res.status(404).json({
            message: "SubCategory not found"
        })
    }


    const brand = await Brand.findById(brandId)
    if(!brand){
        return res.status(404).json({
            message: "Brand not found"
        })
    }


    try{
        const result = await cloudinary.uploader.upload(req.file.path);

        const productSlug = slugify(productName, {lower: true})

        const newProduct = await Product.create({
            productName, description,brandId, subcategoryId, price,
            quantity,gender,stockAlertThreshold,productSlug,
            productImages: result.secure_url 
        }) 

        res.status(201).json({
            message: "product create successfully"
        })
    } catch(error){
        return res.status(501).json({message: error.message})
    }

})



exports.getProductById = asyncHandler(async(req, res) =>{
    const isAdmin = req.user && req.user.role === "admin";
    if(!isAdmin){
        return res.status(403).json({
            message: "Acess, denied... Admin only"
        })
    }

    const productId = req.params.productId;
    const product = await Product.findById(productId);
    if(!product){
        return res.status(404).json({
            message: "product not found"
        })
    }
    res.status(200).json(product)
})


exports.getAllProducts = asyncHandler(async(req, res) =>{
    const isAdmin = req.user && req.user.role === "admin";
    if(!isAdmin){
        return res.status(403).json({
            message: "Acess, denied... Admin only"
        })
    }

    // pagintion
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    const skip = (page - 1) * limit;

// 50
// 1 10  => 1 : 10
// 2 10  => 11: 20
// 3 10  => 21: 30
    // search
    const search = req.query.search || ''
    const searchRegx = new RegExp(search, 'i');
    const totalProducts = await Product.countDocuments({productName: searchRegx})
    const products = await Product.find({productName: searchRegx})
    .skip(skip)
    .limit(limit)
    .sort({ creatAt: -1})



    
    res.status(200).json({
        totalProducts,
        currentPage: page,
        totalPage: Math.ceil(totalProducts / limit),
        products,
    })
})
exports.updateProduct = asyncHandler(async(req, res) =>{
    const isAdmin = req.user && req.user.role === "admin";
    if(!isAdmin){
        return res.status(403).json({
            message: "Acess, denied... Admin only"
        })
    }


    const productId = req.params.productId;
    const product = await Product.findById(productId);
    if(!product){
        return res.status(404).json({
            message: "product not found"
        })
    }


        const {productName, description,brandId, subcategoryId, price,quantity,gender,stockAlertThreshold } = req.body;

    const subCategory = await Subcategory.findById(subcategoryId)
    if(!subCategory){
        return res.status(404).json({
            message: "SubCategory not found"
        })
    }


    const brand = await Brand.findById(brandId)
    if(!brand){
        return res.status(404).json({
            message: "Brand not found"
        })
    }

    if(productName){
        product.productName = productName;
        product.productSlug = slugify(productName, {lower: true})
    }
    if(description) product.description = description;
    if(price) product.price = price;
    if(quantity) product.quantity = quantity;
    if(gender) product.gender = gender;
    if(stockAlertThreshold) product.stockAlertThreshold = stockAlertThreshold;

    if(req.file){
        const result = await cloudinary.uploader.upload(req.file.path)
        product.productImages =result.secure_url ;
    }

    await product.save();

    res.status(200).json({
        message: "product create successfully",
        product
    })


})


exports.deleteProduct = asyncHandler(async(req, res) =>{
    const isAdmin = req.user && req.user.role === "admin";
    if(!isAdmin){
        return res.status(403).json({
            message: "Acess, denied... Admin only"
        })
    }

    const productId = req.params.productId;
    const product = await Product.findById(productId);
    if(!product){
        return res.status(404).json({
            message: "product not found"
        })
    }



    product.isDeleted = true;
    product.deletedAt = new Date();
    product.deletedBy = req.user._id;
    await product.save();
    res.status(200).json({
        message:"product soft deleted"
    })

})




exports.getProductByIdByUser = asyncHandler(async(req, res) =>{
   

    const productId = req.params.productId;
    const product = await Product.findOne({
        _id:productId,
        isDeleted:false
    }).select('-deletedBy -deletedAt');
    if(!product){
        return res.status(404).json({
            message: "product not found"
        })
    }
    res.status(200).json(product)
})


exports.getAllProductsByUser = asyncHandler(async(req, res) =>{
   

    // pagintion
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    const skip = (page - 1) * limit;

// 50
// 1 10  => 1 : 10
// 2 10  => 11: 20
// 3 10  => 21: 30
    // search
    const search = req.query.search || ''
    const searchRegx = new RegExp(search, 'i');
    const totalProducts = await Product.countDocuments({productName: searchRegx})
    const products = await Product.find({productName: searchRegx, isDeleted:false})
    .skip(skip)
    .limit(limit)
    .sort({ creatAt: -1})



    
    res.status(200).json({
        totalProducts,
        currentPage: page,
        totalPage: Math.ceil(totalProducts / limit),
        products,
    })
})