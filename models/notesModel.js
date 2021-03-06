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
    minlength: 3,
    maxlength: 25,
  },
  content: {
    type: String,
    required: true,
    minlength: 3,
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
  createdAt: {
    type: Date,
    default: Date.now
  },
});

const Note = model('Note', NoteSchema);

module.exports = Note;
