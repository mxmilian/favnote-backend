const Notes = require('../models/notesModel');
const Friend = require('../models/friendsModel');
const catchAsync = require('../errors/catchAsync');
const {
  readOne,
  readAll,
  readAllOneType,
  deleteOne,
  updateOne,
} = require('../factory/crudFactory');

const createNote = catchAsync(async (req, res, next) => {
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

const readSharedNotes = catchAsync(async (req, res, next) => {
  const friends = await Friend.find({ requester: req.user._id, status: 3 });

  const friendsID = friends.map((el) => el.recipient);
  const sharedNotes = await Notes.find({ userID: { $in: friendsID }, type: req.query.type });

  console.log(sharedNotes);

  res.status(200).json({
    status: 'success',
    data: {
      sharedNotes,
    },
  });
});

const readNote = readOne(Notes);
const readAllNotes = readAll(Notes);
const readAllNotesOfOneType = readAllOneType(Notes);
const deleteNote = deleteOne(Notes);
const updateNote = updateOne(Notes);

module.exports = {
  createNote,
  readNote,
  readSharedNotes,
  readAllNotes,
  readAllNotesOfOneType,
  deleteNote,
  updateNote,
};
