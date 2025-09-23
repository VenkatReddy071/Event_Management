const express = require('express');
const router = express.Router();
const jwt = require('jsonwebtoken');
const { CloudinaryStorage } = require('multer-storage-cloudinary');
const multer = require('multer');

const eventController = require('../../controllers/Events/EventPost');
const cloudinary = require('../../config/cloudnary');
const {verifyToken,checkRole}=require("../../auth/JWT")
const storage = new CloudinaryStorage({
  cloudinary: cloudinary,
  params: {
    folder: 'event-posters',
    format: async (req, file) => 'png',
    public_id: (req, file) => Date.now() + '-' + file.originalname.split('.')[0],
  },
});
const upload = multer({ storage: storage });

router.post(
  '/',
  verifyToken,
  checkRole('organizer'),
  upload.single('posterUrl'),
  eventController.createEvent
);

router.post(
  '/admin/dashboard',
  verifyToken,
  checkRole('admin'),
  upload.single('posterUrl'),
  eventController.createEvent
);
router.get('/', eventController.getEvents);
router.get("/dashboard",verifyToken,
  checkRole('organizer'),eventController.getEventsByCollege)
router.get('/:id', eventController.getEventById);
router.get("/admin/dashboard",verifyToken,checkRole('admin'),eventController.getEventsAdmin)
router.put(
  '/:id',
  verifyToken,
  checkRole('organizer'),
  upload.single('posterUrl'),
  eventController.updateEvent
);

router.put(
  '/admin/dashboard/:id',
  verifyToken,
  checkRole('admin'),
  upload.single('posterUrl'),
  eventController.updateEvent
);
router.delete(
  '/:id',
  verifyToken,
  checkRole('organizer'),
  eventController.deleteEvent
);
router.delete(
  '/admin/dashboard/:id',
  verifyToken,
  checkRole('admin'),
  eventController.deleteEvent
);

module.exports = router;