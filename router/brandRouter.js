const express = require('express');
const router = express.Router();

const brandControllers = require('../controllers/brandControllers');


router.post('/',  brandControllers.createBrand);
router.get('/', brandControllers.getAllBrands);
router.get('/:id', brandControllers.getBrandById);
router.put('/:id',  brandControllers.updateBrand);
router.delete('/:id', brandControllers.deleteBrand);

module.exports = router;
