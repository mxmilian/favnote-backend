const { createAccessToken, createRefreshToken } = require('../utils/authToken');
const { sendRefreshToken } = require('../utils/sendRefreshToken');
const Users = require('../models/usersModel');
const bcrypt = require('bcryptjs');
const catchAsync = require('../errors/catchAsync');
const Errors = require('../errors/Errors');
const { verify } = require('jsonwebtoken');
const { promisify } = require('util');

const filterObj = (obj, ...allowedFields) => {
  const newObj = {};
  Object.keys(obj).forEach((el) => {
    if (allowedFields.includes(el)) newObj[el] = obj[el];
  });
  return newObj;
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

  sendRefreshToken(res, createRefreshToken(newUser));

  return res.status(200).json({
    status: 'success',
    data: {
      accessToken: createAccessToken(newUser),
      newUser,
      message: 'Sign in successfully',
    },
  });
});

const signIn = catchAsync(async (req, res, next) => {
  const { name, email, password } = req.body;

  if ((!name && !email) || !password)
    return next(new Errors('Please input email and password!', 400));

  const user = name
    ? await Users.findOne({ name }).select('+password')
    : await Users.findOne({ email }).select('+password');

  if (!user || !(await bcrypt.compare(password, user.password))) {
    return next(new Errors('Incorrect username and password.', 400));
  }

  sendRefreshToken(res, createRefreshToken(user));

  return res.status(200).json({
    status: 'success',
    data: {
      accessToken: createAccessToken(user),
      user,
      message: 'Sign in successfully',
    },
  });
});

const logOut = catchAsync(async (req, res, next) => {
  sendRefreshToken(res, '');
  res.status(200).json({ status: 'success' });
});

const refresh_token = catchAsync(async (req, res, next) => {
  const token = req.cookies.jid;
  if (!token) {
    return res.status(401).json({
      status: 'failure',
      accessToken: '',
    });
  }

  let payload = null;

  try {
    payload = await promisify(verify)(token, process.env.REFRESH_TOKEN_SECRET);
  } catch (e) {
    return res.status(401).json({
      status: 'failure',
      accessToken: '',
    });
  }

  const user = await Users.findOne({ _id: payload.userId });

  if (!user) {
    return res.status(401).json({
      status: 'failure',
      accessToken: '',
    });
  }

  if (user.tokenVersion !== payload.tokenVersion) {
    return res.status(401).json({
      status: 'failure',
      accessToken: '',
    });
  }

  sendRefreshToken(res, createRefreshToken(user));

  res.status(200).json({
    status: 'success',
    data: {
      accessToken: createAccessToken(user),
      user,
    },
  });
});

const readAllUsers = catchAsync(async (req, res, next) => {
  const readDoc = await Users.find();
  res.status(200).json({
    status: 'success',
    data: {
      readDoc,
    },
  });
});

const readUser = catchAsync(async (req, res, next) => {
  const readDoc = await Users.findById(req.user._id);
  res.status(200).json({
    status: 'success',
    data: {
      readDoc,
    },
  });
});

const updateUser = catchAsync(async (req, res, next) => {
  if (req.body.password || req.body.passwordConfirm) {
    return next(new Errors('This route is not for password updates.', 400));
  }
  const filteredBody = filterObj(req.body, 'name', 'email');
  // if (req.file) filteredBody.photo = req.file.filename;

  // 3) Update user document
  const updatedUser = await Users.findByIdAndUpdate(process.env.USERID, filteredBody, {
    new: true,
    runValidators: true,
  });

  res.status(200).json({
    status: 'success',
    data: {
      user: updatedUser,
    },
  });
});

module.exports = { signUp, signIn, logOut, readUser, readAllUsers, refresh_token, updateUser };
