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
    console.log(req.user._id);
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
    console.log(req);
    const readDoc = await Model.find({ author: req.user._id, type: req.query.type });
    res.status(200).json({
      status: 'success',
      data: {
        readDoc,
      },
    });
  });

module.exports = { readOne, readAll, readAllOneType };
