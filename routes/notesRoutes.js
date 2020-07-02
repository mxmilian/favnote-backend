const router = require('express').Router();
const { protectRoute } = require('../middlewares/authProtect');

const {
  createNote
} = require('../controllers/notesController')

// Protect all routes after this middleware
router.use(protectRoute);

router.route('/').post(createNote);

module.exports = router;
