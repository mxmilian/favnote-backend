const Notes = require('../models/notesModel');
const catchAsync = require('../errors/catchAsync');
const { readOne, readAll, readAllOneType } = require('../factory/crudFactory');

const createNote = catchAsync(async (req, res, next) => {
  console.log(req.user);
  const createdDoc = await Notes.create({
    type: req.body.type, // twitters, articles, notes
    title: req.body.title,
    content: req.body.content,
    articleUrl: req.body.articleUrl,
    twitterName: req.body.twitterName,
    author: req.user.name,
    userID: req.user._id,
  });
  res.status(201).json({
    status: 'success',
    data: {
      createdDoc,
    },
  });
});

const readNote = readOne(Notes);
const readAllNotes = readAll(Notes);
const readAllNotesOfOneType = readAllOneType(Notes);

module.exports = {
  createNote,
  readNote,
  readAllNotes,
  readAllNotesOfOneType,
};
