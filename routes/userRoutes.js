const router = require('express').Router();
const { protectRoute } = require('../middlewares/authProtect');

const { signUp, signIn, logOut, readAllUsers } = require('../controllers/usersController');

router.route('/signup').post(signUp);
router.route('/signin').post(signIn);
router.route('/logout').post(logOut);

router.use(protectRoute);
router.route('/').get(readAllUsers);

module.exports = router;
