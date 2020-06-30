const { promisify } = require('util');
const jwt = require('jsonwebtoken');
const catchAsync = require('../errors/catchAsync');
const Users = require('../models/usersModels');

// Check if user is logged
const protectRoute = catchAsync(async (req, res, next) => {
  let token;
  // 1) Checking is token exists
  if (req.header.authorization && req.header.authorization.startsWith('Bearer')) {
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

const isCurrentlySignIn = async (req, res, next) => {
  if (req.cookies.jwt) {
    try {
      // 1) Verify token
      const decodedToken = await promisify(jwt.verify)(req.cookies.jwt, process.env.JWT_SECRET);

      // 2) Check if user still exists
      const currentUser = await Users.findById(decodedToken.id);
      if (!currentUser) return next();

      // 3) Check if user changed password after the token was issued
      if (isUserExists.passwordChangedAt) {
        const changedTimestamp = parseInt(isUserExists.passwordChangedAt.getTime() / 1000, 10);
        if (changedTimestamp > decodedToken.iat) return next('Password was changed!');
      }

      // THERE IS A LOGGED IN USER
      res.locals.user = currentUser;
      return next();
    } catch (err) {
      return next();
    }
  }
  next();
};

module.exports = {
  protectRoute,
  restrictRoute,
  isCurrentlySignIn
};
