const express = require('express');
const router = express.Router();
const authController = require('../controllers/authController');
router.post('/sign-up', authController.signUp)
router.post('/virify', authController.virfiyEmail)
router.post('/login', authController.login)
router.post('/forget-password', authController.forgetPassword)
router.post('/rest-password', authController.resetPassword)
router.post('/refresh-token', authController.refreshToken)
router.post('/logout', authController.logout)
module.exports = router;