const router = require('express').Router();

const { signUp } = require('../controllers/usersControllers');

router.route('/').post(signUp);

module.exports = router;