const express = require('express');
const router = express.Router();
const { CloudinaryStorage } = require('multer-storage-cloudinary');
const multer = require('multer');

const registerController = require('../../controllers/Events/EventRegistrations');
const cloudinary = require('../../config/cloudnary');
const { verifyToken, checkRole } = require('../../auth/JWT');

const fileFilter = (req, file, cb) => {
  const allowedTypes = ['image/jpeg', 'image/jpg', 'image/png'];
  if (allowedTypes.includes(file.mimetype)) {
    cb(null, true);
  } else {
    cb(new Error('Invalid file type. Only JPG, JPEG, and PNG are allowed.'), false);
  }
};

const storage = new CloudinaryStorage({
  cloudinary: cloudinary,
  params: {
    folder: 'registration-screenshots',
    format: async (req, file) => 'png',
    public_id: (req, file) => Date.now() + '-' + file.originalname.split('.')[0],
  },
});
const upload = multer({ 
  storage: storage,
  fileFilter: fileFilter 
});

const handleUploadError = (req, res, next) => {
  upload.single('paymentScreenShot')(req, res, function(err) {
    if (err instanceof multer.MulterError) {
      return res.status(400).json({ message: err.message });
    } else if (err) {
      return res.status(400).json({ message: err.message });
    }
    next();
  });
};

router.post(
  '/',
  handleUploadError,
  registerController.createRegistration
);

router.get(
  '/all',
  verifyToken,
  checkRole('admin'),
  registerController.getAllRegistrations
);

router.get(
  '/registrations',
  verifyToken,
  checkRole('organizer'),
  registerController.getRegistrationsForCollege
);

router.get(
  '/event/:eventId',
  verifyToken,
  checkRole('organizer'),
  registerController.getRegistrationsByEventId
);

module.exports = router;