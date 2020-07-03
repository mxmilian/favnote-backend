const router = require('express').Router();
const { protectRoute } = require('../middlewares/authProtect');

const {
  createNote,
  readNote,
  readAllNotes,
  readAllNotesOfOneType,
} = require('../controllers/notesController');

// Protect all routes after this middleware
router.use(protectRoute);

router.route('/').post(createNote).get(readAllNotes);
router.route('/:id').get(readNote);
router.route('/type').get(readAllNotesOfOneType);

module.exports = router;
