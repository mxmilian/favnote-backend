const catchAsync = require('../errors/catchAsync');
const Errors = require('../errors/Errors');

// const createOne = (Model) =>
//   catchAsync(async (req, res, next) => {
//     const createdDoc = await Model.create(req.body);
//     res.status(201).json({
//       status: 'success',
//       data: {
//         createdDoc,
//       },
//     });
//   });

const readOne = (Model) =>
  catchAsync(async (req, res, next) => {
    const readDoc = await Model.findById(req.query.id);
    res.status(200).json({
      status: 'success',
      data: {
        readDoc,
      },
    });
  });

const readAll = (Model) =>
  catchAsync(async (req, res, next) => {
    const readDoc = await Model.find({ userID: req.user._id });
    res.status(200).json({
      status: 'success',
      data: {
        readDoc,
      },
    });
  });

const readAllOneType = (Model) =>
  catchAsync(async (req, res, next) => {
    const readDoc = await Model.find({ userID: req.user._id, type: req.query.type });
    res.status(200).json({
      status: 'success',
      data: {
        readDoc,
      },
    });
  });

const deleteOne = (Model) =>
  catchAsync(async (req, res, next) => {
    const deletedDoc = await Model.findByIdAndDelete(req.params.id);

    res.status(200).json({
      status: 'success',
      data: {
        deletedDoc,
      },
    });
  });

const updateOne = (Model) => {
  return catchAsync(async (req, res, next) => {
    const doc = await Model.findById(req.params.id);

    if (!doc)
      return res.status(401).json({
        status: 'fail',
        data: {
          message: 'Not document found to update!',
        },
      });

    if (JSON.stringify(doc.userID) !== JSON.stringify(req.user._id)) {
      return res.status(400).json({
        status: 'failure',
        data: {
          message: 'You dont have permission to do this!',
        },
      });
    }

    const updatedDoc = await Model.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true,
    });

    if (!updatedDoc)
      return res.status(200).json({
        status: 'fail',
        data: {
          message: 'Not document found to update!',
        },
      });

    return res.status(200).json({
      status: 'success',
      data: {
        message: 'Doc updated',
        updatedDoc,
      },
    });
  });
};

module.exports = { readOne, readAll, readAllOneType, deleteOne, updateOne };
