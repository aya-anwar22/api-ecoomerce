const Brand = require('../models/Brand');
const slugify = require('slugify');
const asyncHandler = require('express-async-handler');
const ApiError = require('../utils/apiError');

// Create Brand
exports.createBrand = asyncHandler(async (req, res) => {
    const { brandName, brandImage } = req.body;

    const newBrand = await Brand.create({
        brandName,
        brandSlug: slugify(brandName),
        brandImage
    });

    res.status(201).json({
        message: 'Brand created successfully',
        data: newBrand
    });
});

// Get All Brands (excluding soft-deleted ones)
exports.getAllBrands = asyncHandler(async (req, res) => {
    const brands = await Brand.find({ isDeleted: false });
    res.status(200).json(brands);
});

exports.getBrandById = asyncHandler(async (req, res, next) => {
    const brand = await Brand.findById(req.params.id);
    if (!brand || brand.isDeleted) {
        return next(new ApiError('Brand not found', 404));
    }

    res.status(200).json(brand);
});

exports.updateBrand = asyncHandler(async (req, res, next) => {
    const { brandName, brandImage } = req.body;

    const updates = {
        brandName,
        brandSlug: slugify(brandName),
        brandImage
    };

    const brand = await Brand.findByIdAndUpdate(req.params.id, updates, { new: true });

    if (!brand || brand.isDeleted) {
        return next(new ApiError('Brand not found', 404));
    }

    res.status(200).json({
        message: 'Brand updated successfully',
        data: brand
    });
});


exports.deleteBrand = asyncHandler(async (req, res, next) => {
    const brand = await Brand.findById(req.params.id);

    if (!brand || brand.isDeleted) {
        return next(new ApiError('Brand not found or already deleted', 404));
    }

    brand.isDeleted = true;
    brand.deletedAt = new Date();
    brand.deletedBy = req.user._id; 

    await brand.save();

    res.status(200).json({ message: 'Brand soft-deleted successfully' });
});
