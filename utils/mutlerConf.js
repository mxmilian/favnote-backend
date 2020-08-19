const multer = require('multer');

const upload = multer({ dest: 'public/image/users' });

const uploadUserPhoto = upload.single('photo');

module.exports = {
  uploadUserPhoto,
};
