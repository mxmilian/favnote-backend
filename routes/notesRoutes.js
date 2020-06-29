const router = require('express').Router();

const {
  readAllNotes
} = require('../controllers/notesControllers')

router.route('/').get(readAllNotes);

module.exports = router;
