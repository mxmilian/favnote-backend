const Notes = require('../models/notesModel');
const Friend = require('../models/friendsModel');
const catchAsync = require('../errors/catchAsync');
const Errors = require('../errors/Errors');
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
    public: req.body.public,
    twitterName: req.body.twitterName,
    author: req.user.name,
    userID: req.user._id,
  });

  console.log('trololo')
  if(!createdDoc) {
    return next(new Errors('You are not logged!', 401));
  }

  res.status(201).json({
    status: 'success',
    data: {
      createdDoc,
    },
  });
});

const readAllNotesWithShared = catchAsync(async (req, res, next) => {
  const ownNotes = await Notes.find({ userID: req.user._id, type: req.query.type });
  const friends = await Friend.find({ requester: req.user._id, status: 3 });

  const friendsID = friends.map((el) => el.recipient);
  const sharedNotes = await Notes.find({
    userID: { $in: friendsID },
    type: req.query.type,
    public: true,
  });

  res.status(200).json({
    status: 'success',
    data: {
      ownNotes,
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
  readAllNotesWithShared,
  readAllNotes,
  readAllNotesOfOneType,
  deleteNote,
  updateNote,
};
