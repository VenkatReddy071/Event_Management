const express = require('express');
const router = express.Router();
const dashboardController = require('../../controllers/OrganizerDashboard/Overview');
const {verifyToken,checkRole} = require('../../auth/JWT');

router.get('/', verifyToken,checkRole('organizer'), dashboardController.getDashboardData);
router.get('/events', verifyToken,checkRole('organizer'), dashboardController.getRecentEvents);
router.get('/registrations',verifyToken,checkRole('organizer'), dashboardController.getRecentRegistrations);

module.exports = router;