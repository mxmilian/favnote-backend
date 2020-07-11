const router = require('express').Router();
const { protectRoute } = require('../middlewares/authProtect');
const { reqFriend, checkFriends, accFriend, rejFriend } = require('../controllers/friendsController');

router.use(protectRoute);
router.route('/').get(checkFriends);
router.route('/req').post(reqFriend);
router.route('/acc').post(accFriend);
router.route('rej').post(rejFriend);

module.exports = router;
