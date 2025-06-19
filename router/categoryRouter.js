const express = require('express');
const router = express.Router();
const categoryControllers = require('../controllers/categoryControllers');
const {
    createCategoryValidator,
    getCategoryByIdValidator,
    updateCategoryValidator,
    deleteCategoryValidator


} = require('../utils/vailditor/categoryVailditor')





router.post('/', createCategoryValidator, categoryControllers.createCategotry)


router.get('/', categoryControllers.getAllCategories);

router.get('/:id',getCategoryByIdValidator  ,categoryControllers.getCategoryById);
router.put('/:id', updateCategoryValidator, categoryControllers.updateCategory);
router.delete('/:id',deleteCategoryValidator,  categoryControllers.DeletCategory);

module.exports = router;
