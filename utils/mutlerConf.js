const multer = require('multer');
const sharp = require('sharp');
const Errors = require('../errors/Errors');
const catchAsync = require('../errors/catchAsync');

// const multerStorage = multer.diskStorage({
//   destination: (req, file, cb) => {
//     cb(null, 'public/image/users');
//   },
//   filename: (req, file, cb) => {
//     const extensions = file.mimetype.split('/')[1];
//     //USER ID SHOULD CHANGE IN FUTURE!
//     cb(null, `user-${process.env.USERID}-${Date.now()}.${extensions}`);
//   },
// });

const multerStorage = multer.memoryStorage();

const multerFilter = (req, file, cb) => {
  if (file.mimetype.startsWith('image')) {
    cb(null, true);
  } else {
    cb(new Errors('Only images can be uploaded', 400), false);
  }
};

const upload = multer({ storage: multerStorage, fileFilter: multerFilter });

const uploadUserPhoto = upload.single('photo');

const resizeUserPhoto = catchAsync(async (req, res, next) => {
  if (!req.file) {
    return next();
  }

  req.file.filename = `user-${process.env.USERID}-${Date.now()}.jpeg`;

  await sharp(req.file.buffer)
    .resize(500, 500)
    .toFormat('jpeg')
    .jpeg({ quality: 90 })
    .toFile(`public/image/users/${req.file.filename}`);

  next();
});

module.exports = {
  uploadUserPhoto,
  resizeUserPhoto,
};
