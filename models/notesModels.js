const { Schema, model } = require('mongoose');

const NOTE_TYPES = ['twitters', 'articles', 'notes'];

const NoteSchema = new Schema({
  type: {
    type: String,
    enum: NOTE_TYPES,
    required: true,
  },
  title: {
    type: String,
    required: true,
    minlength: 5,
    maxlength: 20,
  },
  content: {
    type: String,
    required: true,
    minlength: 5,
    maxlength: 250,
  },
  articleUrl: {
    type: String,
    default: null,
  },
  twitterName: {
    type: String,
    default: null,
  },
  userID: {
    type: String,
    required: true,
  },
});

const Note = model('Note', NoteSchema);

module.exports = Note;
