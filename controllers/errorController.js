const Error = require('../errors/Errors');
const { createErrorDev } = require('../factory/errorFactory');

const errorController = (error, req, res, next) => {
  error.statusCode = error.statusCode || 500;
  error.status = error.status || 'error';

  createErrorDev(error, req, res);
};

module.exports = { errorController };
