const express = require('express');
const router = express.Router();
const collegeController = require('../controllers/CollegeController');
const {verifyToken,checkRole}=require("../auth/JWT");
router.post('/register', collegeController.register);
router.post('/login', collegeController.login);

router.put('/approve/:id',verifyToken,checkRole('admin'), collegeController.approveCollege);
router.put("/reject/:id",verifyToken,checkRole('admin'),collegeController.rejectCollege)
router.get("/list",verifyToken,checkRole('admin'),collegeController.getAllColleges);
module.exports = router;
