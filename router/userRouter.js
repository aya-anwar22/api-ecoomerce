const express = require('express');
const router = express.Router();
const userController = require('../controllers/userController');
const authentication = require('../middleWare/authentcation')

router.get('/profile', authentication, userController.getProfile)
router.put('/profile', authentication, userController.updateProfile)
router.delete('/profile', authentication, userController.deleteProfile)


router.post('/', authentication, userController.addUser)
router.get('/', authentication, userController.getAllUser)
router.get('/:userId', authentication, userController.getUserById)
router.put('/:userId', authentication, userController.updateUserByAdmin)
router.delete('/:userId', authentication, userController.deletUser)

module.exports = router;