const router = require('express').Router();
const { protectRoute } = require('../middlewares/authProtect');

const {
  createNote,
  readNote,
  readAllNotes,
  readAllNotesOfOneType,
  deleteNote
} = require('../controllers/notesController');

// Protect all routes after this middleware
router.use(protectRoute);

router.route('/').post(createNote).get(readAllNotes).delete(deleteNote);
router.route('/type').get(readAllNotesOfOneType);
router.route('/:id').get(readNote);

module.exports = router;
