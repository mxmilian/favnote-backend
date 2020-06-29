const Users = require('../models/usersModels');
const jwt = require('jsonwebtoken');
//const bcrypt = require('bcryptjs');
//const crypto = require('crypto');
const catchAsync = require('../errors/catchAsync');

const signToken = (id) =>
  jwt.sign({ id }, process.env.JWT_SECRET, {
    expiresIn: process.env.JWT_EXPIRES_IN,
  });

const createSendToken = (user, statusCode, res) => {
  const token = signToken(user._id);
  res.cookie('jwt', token, {
    expires: new Date(Date.now() + process.env.JWT_COOKIE_EXPIRES_IN * 24 * 60 * 60 * 1000),
    httpOnly: true,
  });
  user.password = undefined;

  res.status(statusCode).json({
    status: 'success',
    data: {
      token,
      user,
    },
  });
};

const signUp = catchAsync(async (req, res, next) => {
  const { name, email, password, confirmPassword } = req.body;
  const newUser = await Users.create({
    name,
    email,
    password,
    confirmPassword,
  });
  await newUser.save({ validateBeforeSave: false });
  createSendToken(newUser, 201, res);
});

module.exports = { signUp };