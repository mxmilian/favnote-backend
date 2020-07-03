const { Schema, model } = require('mongoose');

const NoteSchema = new Schema({
  type: {
    type: String,
    enum: ['twitters', 'articles', 'notes'],
    required: true,
  },
  author: {
    type: String,
    ref: 'User',
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
  public: {
    type: Boolean,
    default: false,
  },
  userID: {
    type: Schema.ObjectId,
    ref: 'User',
    required: true,
  },
});

const Note = model('Note', NoteSchema);

module.exports = Note;
