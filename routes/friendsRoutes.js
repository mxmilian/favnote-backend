const router = require('express').Router();
const { protectRoute } = require('../middlewares/authProtect');
const { reqFriend, checkFriends } = require('../controllers/friendsController');

router.use(protectRoute);
router.route('/').post(reqFriend).get(checkFriends);
module.exports = router;
