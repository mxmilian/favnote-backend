const router = require('express').Router();

const {
  createNote
} = require('../controllers/notesControllers')

router.route('/').post(createNote);

module.exports = router;
