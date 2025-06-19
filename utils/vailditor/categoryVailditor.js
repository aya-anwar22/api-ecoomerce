const { check } = require('express-validator');
const vaildatorMiddleWare = require('../../middleWare/vaildatorMiddleWare');

exports.createCategoryValidator = [
  check('categoryName')
    .notEmpty().withMessage('Category name is required')
    .isLength({ min: 3 }).withMessage('Before DBCategory name must be at least 3 characters')
    .isLength({ max: 100 }).withMessage('Category name must be less than 100 characters'),
    
  
  
  check('categoryImage')
    .notEmpty().withMessage('Category image is required'),

  vaildatorMiddleWare
];

exports.getCategoryByIdValidator = [
  check('id')
    .isMongoId().withMessage('Invalid Category ID'),
  vaildatorMiddleWare
];

exports.updateCategoryValidator = [
  check('id')
    .isMongoId().withMessage('Invalid Category ID'),

  check('categoryName')
    .optional()
    .isLength({ min: 3 }).withMessage('Category name must be at least 3 characters')
    .isLength({ max: 100 }).withMessage('Category name must be less than 100 characters'),


  check('categoryImage')
    .optional(),

  vaildatorMiddleWare
];

exports.deleteCategoryValidator = [
  check('id')
    .isMongoId().withMessage('Invalid Category ID'),
  vaildatorMiddleWare
];
