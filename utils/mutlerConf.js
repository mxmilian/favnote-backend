const multer = require('multer');
const Errors = require('../errors/Errors');

const multerStorage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, 'public/image/users');
  },
  filename: (req, file, cb) => {
    const extensions = file.mimetype.split('/')[1];
    //USER ID SHOULD CHANGE IN FUTURE!
    cb(null, `user-${process.env.USERID}-${Date.now()}.${extensions}`);
  },
});

const multerFilter = (req, file, cb) => {
  if (file.mimetype.startsWith('image')) {
    cb(null, true);
  } else {
    cb(new Errors('Only images can be uploaded', 400), false);
  }
};

const upload = multer({ storage: multerStorage, fileFilter: multerFilter });

const uploadUserPhoto = upload.single('photo');

module.exports = {
  uploadUserPhoto,
};
