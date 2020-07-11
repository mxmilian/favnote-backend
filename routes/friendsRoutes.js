const router = require('express').Router();
const { protectRoute } = require('../middlewares/authProtect');
const { reqFriend } = require('../controllers/friendsController');

router.use(protectRoute);
router.route('/').post(reqFriend);
module.exports = router;
