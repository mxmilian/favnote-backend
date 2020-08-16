const { promisify } = require('util');
const { verify } = require('jsonwebtoken');
const catchAsync = require('../errors/catchAsync');
const Users = require('../models/usersModel');
const Errors = require('../errors/Errors');

// Check if user is logged
const protectRoute = catchAsync(async (req, res, next) => {
  let token;
  // 1) Checking is token exists
  if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
    token = req.headers.authorization.split(' ')[1];
  }
  if (!token) return next(new Errors('You are not logged!', 401));

  // 2) Verify the token
  const decodedToken = await promisify(verify)(token, process.env.ACCESS_TOKEN_SECRET);

  // 3) Check if user still exists
  const isUserExists = await Users.findById(decodedToken.userId);
  if (!isUserExists) return next(new Errors('This user is not exists!', 401));

  // 4) Check if user changed password after the token was issued
  if (isUserExists.passwordChangedAt) {
    const changedTimestamp = parseInt(isUserExists.passwordChangedAt.getTime() / 1000, 10);
    if (changedTimestamp > decodedToken.iat) return next(new Errors('Password was changed!', 401));
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
      return next(new Errors('You do not have permission to access that!', 401));
    next();
  };
};

// This just checking is user is currently logged but without throwing any error :)
const isCurrentlySignIn = async (req, res, next) => {
  if (req.cookies.jid) {
    try {
      // 1) Verify token
      const decodedToken = await promisify(verify)(req.cookies.jid, process.env.ACCESS_TOKEN_SECRET);

      // 2) Check if user still exists
      const currentUser = await Users.findById(decodedToken.id);
      if (!currentUser) return next();

      // 3) Check if user changed password after the token was issued
      if (isUserExists.passwordChangedAt) {
        const changedTimestamp = parseInt(isUserExists.passwordChangedAt.getTime() / 1000, 10);
        if (changedTimestamp > decodedToken.iat)
          return next(new Errors('Password was changed!', 401));
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
  isCurrentlySignIn,
};
