const catchAsync = require('../errors/catchAsync');

const createOne = Model =>
  catchAsync(async (req, res, next) => {
    const createdDoc = await Model.create(req.body);
    res.status(201).json({
      status: 'success',
      data: {
        createdDoc
      }
    });
  });

module.exports = { createOne };