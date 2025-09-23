const express = require('express');
const router = express.Router();
const { CloudinaryStorage } = require('multer-storage-cloudinary');
const multer = require('multer');

const subeventController = require('../../controllers/Events/SubEvent');
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
  params: (req, file) => {
    let folder = file.fieldname === 'photo' ? 'subevent-photos' : 'subevent-scanners';
    return {
      folder: folder,
      format: 'png',
      public_id: Date.now() + '-' + file.originalname.split('.')[0],
    };
  },
});
const upload = multer({ 
  storage: storage,
  fileFilter: fileFilter 
});

const handleUploadError = (req, res, next) => {
  upload.fields([{ name: 'photo', maxCount: 1 }, { name: 'paymentScanner', maxCount: 1 }])(req, res, function(err) {
    if (err instanceof multer.MulterError) {
      return res.status(400).json({ message: err.message });
    } else if (err) {
      return res.status(400).json({ message: err.message });
    }
    next();
  });
};

router.post(
  '/new',
  verifyToken,
  checkRole('organizer'),
  handleUploadError,
  subeventController.createSubevent
);

router.get('/:eventId', subeventController.getSubeventsByEventId);
router.get('/details/:id', subeventController.getSubeventById);

router.put(
  '/:id',
  verifyToken,
  checkRole('organizer'),
  handleUploadError,
  subeventController.updateSubevent
);

router.delete(
  '/:id',
  verifyToken,
  checkRole('organizer'),
  subeventController.deleteSubevent
);

router.get("/dashboard/all",
  verifyToken,
  checkRole('organizer'),
  subeventController.getEventsByCollege 
)
module.exports = router;