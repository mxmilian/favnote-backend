const router = require('express').Router();
const { protectRoute } = require('../middlewares/authProtect');

const {
  signUp,
  signIn,
  logOut,
  readUser,
  readAllUsers,
  refresh_token
} = require('../controllers/usersController');

router.route('/signup').post(signUp);
router.route('/signin').post(signIn);
router.route('/signout').get(logOut);
router.route('/refresh_token').post(refresh_token);

router.use(protectRoute);
router.route('/').get(readAllUsers);
router.route('/user').get(readUser);

module.exports = router;
