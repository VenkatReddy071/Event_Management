const express = require('express');
const router = express.Router();
const { verifyToken, checkRole } = require('../../auth/JWT');
const adminController = require('../../controllers/Admin/AdminOverview');

router.get("/dashboard-stats", verifyToken, checkRole('admin'), adminController.getDashboardStats);
router.get("/user-stats", adminController.getDashboardStats);
module.exports = router;
