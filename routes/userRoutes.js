const router = require('express').Router();

const { signUp, signIn, logOut } = require('../controllers/usersController');

router.route('/signup').post(signUp);
router.route('/signin').post(signIn);
router.route('/logout').post(logOut);

module.exports = router;