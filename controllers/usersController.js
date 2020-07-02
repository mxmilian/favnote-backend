const Users = require('../models/usersModel');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
const catchAsync = require('../errors/catchAsync');
const Errors = require('../errors/Errors');

const signToken = (id) =>
  jwt.sign({ id }, process.env.JWT_SECRET, {
    expiresIn: process.env.JWT_EXPIRES_IN,
  });

const createSendToken = (user, statusCode, res, message) => {
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
      message,
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
  createSendToken(newUser, 201, res, 'Account created successfully');
});

const signIn = catchAsync(async (req, res, next) => {
  const { name, email, password } = req.body;

  if ((!name && !email) || !password) return next(new Errors('Please input email or password!', 400));

  const user = name
    ? await Users.findOne({ name }).select('+password')
    : await Users.findOne({ email }).select('+password');

  if (!user || !(await bcrypt.compare(password, user.password))) return next();

  createSendToken(user, 200, res, 'Logged successfully');
});

const logOut = catchAsync(async (req, res, next) => {
  res.cookie('jwt', 'logout', {
    expires: new Date(Date.now() + 10 * 1000),
    httpOnly: true,
  });
  res.status(200).json({ status: 'success' });
});

module.exports = { signUp, signIn, logOut };
