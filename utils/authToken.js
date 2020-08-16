const { sign } = require('jsonwebtoken');

const createAccessToken = (user) => {
  return sign({ userId: user._id }, process.env.ACCESS_TOKEN_SECRET, {
    expiresIn: process.env.JWT_ACCESS_EXPIRES,
  });
};

const createRefreshToken = (user) => {
  return sign(
    { userId: user._id, tokenVersion: user.tokenVersion },
    process.env.REFRESH_TOKEN_SECRET, {
      expiresIn: process.env.JWT_REFRESH_EXPIRES,
    }
);
};

module.exports = {
 createAccessToken,
 createRefreshToken
}