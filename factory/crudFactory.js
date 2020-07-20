const catchAsync = require('../errors/catchAsync');

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
    const readDoc = await Model.findById(req.params.id);
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
    console.log(req.query);
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
    const deletedDoc = await Model.findByIdAndDelete(req.query.id);

    res.status(200).json({
      status: 'success',
      data: {
        deletedDoc,
      },
    });
  });

const updateOne = (Model) =>
  catchAsync(async (req, res, next) => {
    const updatedDoc = await Model.findByIdAndUpdate(req.query.id, req.body, {
      new: true,
      runValidators: true,
    });

    if (!updatedDoc)
      res.status(200).json({
        status: 'fail',
        data: {
          message: 'Not document fount to update!',
        },
      });

    res.status(200).json({
      status: 'success',
      data: {
        message: 'Doc updated',
        updatedDoc
      },
    });
  });

module.exports = { readOne, readAll, readAllOneType, deleteOne, updateOne };
