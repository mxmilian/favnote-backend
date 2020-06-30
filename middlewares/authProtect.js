const { promisify } = require('util');
const jwt = require('jsonwebtoken');
const catchAsync = require('../errors/catchAsync');
const Users = require('../models/usersModels');

// Check if user is logged
const protectRoute = catchAsync(async (req, res, next) => {
  let token;

  // 1) Checking is token exists
  if (req.header.authorization && req.header.authorization.startsWith('Bearer')) {
    console.log(req.header.authorization);
    token = req.header.authorization.split(' ')[1];
  } else if (req.cookies.jwt) {
    token = req.cookies.jwt;
  }
  if (!token) return next(console.log('token invalid'));

  // 2) Verify the token
  const decodedToken = await promisify(jwt.verify)(token, process.env.JWT_SECRET);

  // 3) Check if user still exists
  const isUserExists = await Users.findById(decodedToken.id);
  if (!isUserExists) return next(console.log('user not exists anymore'));

  // 4) Check if user changed password after the token was issued
  if (isUserExists.passwordChangedAt) {
    const changedTimestamp = parseInt(isUserExists.passwordChangedAt.getTime() / 1000, 10);
    if (changedTimestamp > decodedToken.iat) return next('Password was changed!');
  }

  //Create req.user to be available in next middleware
  res.locals.user = isUserExists;
  req.user = isUserExists;
  next();
});

//Check if user has specific role
const restrictRoute = (...roles) => {
  return (req, res, next) => {
    if (!roles.includes(req.user.role))
      return next(console.log('You do not have permission to get access'));
    next();
  };
};

module.exports = {
  protectRoute,
  restrictRoute
};