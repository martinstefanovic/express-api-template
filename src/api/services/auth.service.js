const User = require('../models/User.model');
const { omit } = require('lodash');
const RefreshToken = require('../models/refreshToken.model');
const moment = require('moment-timezone');
const { jwtExpirationInterval } = require('../../config/vars');
const PasswordResetToken = require('../models/passwordResetToken.model');
const emailProvider = require('../services/emails/emailProvider');
const httpStatus = require('http-status');
const APIError = require('../errors/api-error');

/**
 * Returns a formated object with tokens
 * @private
 */
function generateTokenResponse(user, accessToken) {
  const tokenType = 'Bearer';
  const refreshToken = RefreshToken.generate(user).token;
  const expiresIn = moment().add(jwtExpirationInterval, 'minutes');
  return {
    tokenType,
    accessToken,
    refreshToken,
    expiresIn,
  };
}

module.exports.register = async (reqBody) => {
  const userData = omit(reqBody, 'role');
  const user = await new User(userData).save();
  const userTransformed = user.transform();
  const token = generateTokenResponse(user, user.token());

  return { token, userTransformed };
};

module.exports.login = async (reqBody) => {
  const { user, accessToken } = await User.findAndGenerateToken(reqBody);
  const token = generateTokenResponse(user, accessToken);
  const userTransformed = user.transform();

  return { token, userTransformed };
};

module.exports.refresh = async (reqBody) => {
  const { email, refreshToken } = reqBody;
  const refreshObject = await RefreshToken.findOneAndRemove({
    userEmail: email,
    token: refreshToken,
  });
  const { user, accessToken } = await User.findAndGenerateToken({
    email,
    refreshObject,
  });
  const response = generateTokenResponse(user, accessToken);

  return response;
};

module.exports.sendPasswordReset = async (reqBody) => {
  const { email } = reqBody;
  const user = await User.findOne({ email }).exec();

  if (user) {
    const passwordResetObj = await PasswordResetToken.generate(user);
    emailProvider.sendPasswordReset(passwordResetObj);
    return true;
  }
  return false;
};

module.exports.resetPassword = async (reqBody) => {
  const { email, password, resetToken } = reqBody;
  const resetTokenObject = await PasswordResetToken.findOneAndRemove({
    userEmail: email,
    resetToken,
  });

  const err = {
    status: httpStatus.UNAUTHORIZED,
    isPublic: true,
  };
  if (!resetTokenObject) {
    err.message = 'Cannot find matching reset token';
    throw new APIError(err);
  }
  if (moment().isAfter(resetTokenObject.expires)) {
    err.message = 'Reset token is expired';
    throw new APIError(err);
  }

  const user = await User.findOne({
    email: resetTokenObject.userEmail,
  }).exec();
  user.password = password;
  await user.save();
  emailProvider.sendPasswordChangeEmail(user);

  return err.message ? false : true;
};
