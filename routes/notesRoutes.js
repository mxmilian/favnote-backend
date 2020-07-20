const router = require('express').Router();
const { protectRoute } = require('../middlewares/authProtect');

const {
  createNote,
  readNote,
  readAllNotes,
  readAllNotesOfOneType,
  deleteNote,
  updateNote,
} = require('../controllers/notesController');

// Protect all routes after this middleware
router.use(protectRoute);

router.route('/').post(createNote).get(readAllNotes).delete(deleteNote).patch(updateNote);
router.route('/type').get(readAllNotesOfOneType);
router.route('/:id').get(readNote);

module.exports = router;
