const Friend = require('../models/friendsModel');
const User = require('../models/usersModel');
const catchAsync = require('../errors/catchAsync');

const reqFriend = catchAsync(async (req, res, next) => {
  const UserA = await User.find({ _id: req.user._id });
  const UserB = await User.find({ _id: req.body._id });

  const docA = await Friend.findOneAndUpdate(
    { requester: UserA, recipient: UserB },
    { $set: { status: 1 } },
    { upsert: true, new: true },
  );
  const docB = await Friend.findOneAndUpdate(
    { recipient: UserA, requester: UserB },
    { $set: { status: 2 } },
    { upsert: true, new: true },
  );
  const updateUserA = await User.findOneAndUpdate({ _id: UserA }, { $push: { friends: docA._id } });
  const updateUserB = await User.findOneAndUpdate({ _id: UserB }, { $push: { friends: docB._id } });

  res.status(201).json({
    status: 'success',
    data: {
      docA,
      docB,
      updateUserA,
      updateUserB,
    },
  });
});

const checkFriends = catchAsync(async (req, res, next) => {
  const user = await User.aggregate([
    {
      $lookup: {
        from: Friend.collection.name,
        let: { friends: '$friends' },
        pipeline: [
          {
            $match: {
              recipient: req.user._id,
              $expr: { $in: ['$_id', '$$friends'] },
            },
          },
          { $project: { status: 1 } },
        ],
        as: 'friends',
      },
    },
    {
      $addFields: {
        friendsStatus: {
          $ifNull: [{ $min: '$friends.status' }, 0],
        },
      },
    },
  ]);

  res.status(200).json({
    status: 'success',
    data: {
      user,
    },
  });
});

module.exports = {
  reqFriend,
  checkFriends,
};
