const Subcategory = require('../models/Subcategory');
const slugify = require('slugify');
const asyncHandler = require('express-async-handler');
const ApiError = require('../utils/apiError');

// Create Subcategory
exports.createSubcategory = asyncHandler(async (req, res) => {
    const { subcategoryName, subcategoryImage, categoryId } = req.body;

    const newSubcategory = await Subcategory.create({
        subcategoryName,
        subcategorySlug: slugify(subcategoryName),
        subcategoryImage,
        categoryId
    });

    res.status(201).json({
        message: 'Subcategory created successfully',
        data: newSubcategory
    });
});

// Get All Subcategories (not deleted)
exports.getAllSubcategories = asyncHandler(async (req, res) => {
    const subcategories = await Subcategory.find({ isDeleted: false }).populate('categoryId', 'categoryName');
    res.status(200).json(subcategories);
});

// Get Subcategory by ID
exports.getSubcategoryById = asyncHandler(async (req, res, next) => {
    const subcategory = await Subcategory.findById(req.params.id).populate('categoryId', 'categoryName');

    if (!subcategory || subcategory.isDeleted) {
        return next(new ApiError('Subcategory not found', 404));
    }

    res.status(200).json(subcategory);
});

// Update Subcategory
exports.updateSubcategory = asyncHandler(async (req, res, next) => {
    const { subcategoryName, subcategoryImage, categoryId } = req.body;

    const updates = {
        subcategoryName,
        subcategorySlug: slugify(subcategoryName),
        subcategoryImage,
        categoryId
    };

    const subcategory = await Subcategory.findByIdAndUpdate(req.params.id, updates, { new: true });

    if (!subcategory || subcategory.isDeleted) {
        return next(new ApiError('Subcategory not found', 404));
    }

    res.status(200).json({
        message: 'Subcategory updated successfully',
        data: subcategory
    });
});

// Soft Delete Subcategory
exports.deleteSubcategory = asyncHandler(async (req, res, next) => {
    const subcategory = await Subcategory.findById(req.params.id);

    if (!subcategory || subcategory.isDeleted) {
        return next(new ApiError('Subcategory not found or already deleted', 404));
    }

    subcategory.isDeleted = true;
    subcategory.deletedAt = new Date();
    subcategory.deletedBy = req.user._id; // requires auth middleware

    await subcategory.save();

    res.status(200).json({ message: 'Subcategory soft-deleted successfully' });
});
