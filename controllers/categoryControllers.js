const Category = require('../models/Category');
const slugify = require('slugify')
const asyncHandler = require('express-async-handler');
const apiError = require('../utils/apiError');
const ApiError = require('../utils/apiError');
const Subcategory = require('../models/Subcategory');
const Product = require('../models/Product');
// CRUD
//Create Category
exports.createCategotry = asyncHandler(async(req, res) =>{

        const {categoryName, categoryImage} = req.body;

        const newCategory = await Category.create({
            categoryName,
            categorySlug: slugify(categoryName),
            categoryImage
        });

        res.status(201).json({message: 'Category Created Successfully', data: newCategory})
    
});



// get all categories
exports.getAllCategories = asyncHandler(async(req, res) =>{
   
        const categories = await Category.find();
        res.status(200).json(categories)
   
});



//get category by id
exports.getCategoryById =  asyncHandler(async(req, res, next) =>{

 
        const categoryId = req.params.id;
        const category = await Category.findById(categoryId);

        if(!category){
            return next(new ApiError("Category not found", 404))
            
        }

        res.status(200).json(category)



})

exports.updateCategory = asyncHandler(async(req, res, next) =>{

        const categoryId = req.params.id;
        const {categoryName, categoryImage} = req.body;

        const updates = {
            categoryName,
            categorySlug: slugify(categoryName),
            categoryImage

        }

        const category = await Category.findByIdAndUpdate(categoryId, updates, {new: true});
       if(!category){
            return next(new ApiError("Category not found", 404))
            
        }
        res.status(200).json(category)
});




// delet category
exports.DeletCategory = asyncHandler(async(req, res, next) =>{
    const categoryId = req.params.id;
    const category = await Category.findById(categoryId)
     if(!category){
            return next(new ApiError("Category not found", 404))
            
        }

    category.isDeleted = true;
    category.deletedAt = new Date();
    // category.deletedBy = req.user._id;
    await category.save();


    const subCategories = await Subcategory.find({categoryId})
    for(const sub of subCategories){
        sub.isDeleted = true;
        sub.deletedAt = new Date();
        // sub.deletedBy = req.user._id;
        await sub.save();
    }

    const subCategoryIds = subCategories.map(sub => sub._id);
    const products = await Product.find({ subCategoryId: {$in : subCategoryIds}})

    for(const p of products){
        p.isDeleted = true;
        p.deletedAt = new Date();
        // p.deletedBy = req.user._id;
        await p.save();
    }


    res.status(200).json({message : 'ctegory deleted successfully'})
});