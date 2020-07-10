const { Schema, model } = require('mongoose');
const { isAlphanumeric, isEmail } = require('validator');
const bcrypt = require('bcryptjs');
const crypto = require('crypto');

const UserSchema = new Schema({
  name: {
    type: String,
    required: true,
    unique: true,
    minlength: 10,
    maxlength: 40,
    trim: true,
    validate: {
      validator: isAlphanumeric,
    },
  },
  email: {
    type: String,
    required: true,
    unique: true,
    minlength: 10,
    maxlength: 40,
    trim: true,
    lowercase: true,
    validate: {
      validator: isEmail,
    },
  },
  password: {
    type: String,
    required: true,
    maxlength: 40,
    minlength: 8,
    select: false,
  },
  role: {
    type: String,
    enum: ['user', 'admin'],
    default: 'user',
  },
  friends: [{ type: Schema.Types.ObjectId, ref: 'Friends' }],
  confirmPassword: {
    type: String,
    required: true,
    maxlength: 40,
    minlength: 8,
    validate: {
      //This works only for CREATE and SAVE
      validator: () => this.password === this.confirmPassword,
    },
    createdAt: {
      type: Date,
      default: Date.now
    },
  },
  passwordChangedAt: Date,
  passwordResetToken: String,
  passwordResetExpires: Date,
});

//Encryption password by using mongoose middleware
UserSchema.pre('save', async function (next) {
  if (!this.isModified('password')) return next();
  this.password = await bcrypt.hash(this.password, 12);
  this.confirmPassword = undefined;
  next();
});

UserSchema.pre('save', function (next) {
  if (!this.isModified('password') || this.isNew) return next();
  this.passwordChangedAt = Date.now() - 1000;
  next();
});

UserSchema.methods.createPassResToken = function () {
  const resetToken = crypto.randomBytes(32).toString('hex');
  this.passwordResetToken = crypto.createHash('sha256').update(resetToken).digest('hex');

  this.passwordResetExpires = Date.now() + 10 * 60 * 1000;

  return resetToken;
};

const User = model('User', UserSchema);

module.exports = User;
