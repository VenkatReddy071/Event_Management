const express = require('express');
const router = express.Router();
const {verifyToken,checkRole}=require("../auth/JWT")
const authController = require('../controllers/AuthControllers');

router.post('/signup', authController.sign);
router.post('/login', authController.login);


router.post('/forgot-password', authController.forgotPassword);

router.post('/reset-password', authController.resetPassword);
router.get("/profile",verifyToken,checkRole('student'),authController.profile)
router.get("/profile/admin",verifyToken,checkRole('admin'),authController.profile);
router.get("/profile/organizer",verifyToken,checkRole('organizer'),authController.profile)
module.exports = router;
