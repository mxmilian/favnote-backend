const router = require('express').Router();
const { protectRoute } = require('../middlewares/authProtect');

const {
  createNote,
  readNote,
  readSharedNotes,
  readAllNotes,
  readAllNotesOfOneType,
  deleteNote,
  updateNote,
} = require('../controllers/notesController');

// Protect all routes after this middleware
router.use(protectRoute);

router.route('/').post(createNote).get(readAllNotes);
router.route('/shared').get(readSharedNotes);
router.route('/type').get(readAllNotesOfOneType);
router.route('/:id').get(readNote).delete(deleteNote).patch(updateNote);

module.exports = router;
