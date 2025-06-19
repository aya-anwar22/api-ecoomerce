const express = require('express');
const router = express.Router();
const subcategoryControllers = require('../controllers/subCategoryControllers');

router.post('/',  subcategoryControllers.createSubcategory);
router.get('/', subcategoryControllers.getAllSubcategories);
router.get('/:id', subcategoryControllers.getSubcategoryById);
router.put('/:id',subcategoryControllers.updateSubcategory);
router.delete('/:id',  subcategoryControllers.deleteSubcategory);

module.exports = router;
