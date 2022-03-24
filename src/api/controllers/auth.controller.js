const httpStatus = require('http-status');
const moment = require('moment-timezone');
const { omit } = require('lodash');
const User = require('../models/User.model');
const RefreshToken = require('../models/refreshToken.model');
const PasswordResetToken = require('../models/passwordResetToken.model');
const { jwtExpirationInterval } = require('../../config/vars');
const APIError = require('../errors/api-error');
const emailProvider = require('../services/emails/emailProvider');
const authService = require('../services/auth.service');
const catchAsync = require('../utils/catchAsync');

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

/**
 * Returns jwt token if registration was successful
 * @public
 */
exports.register = catchAsync(async (req, res, next) => {
  try {
    const data = await authService.register(req.body);
    res
      .status(httpStatus.CREATED)
      .json({ token: data.token, user: data.userTransformed });
  } catch (error) {
    return next(User.checkDuplicateEmail(error));
  }
});

/**
 * Returns jwt token if valid username and password is provided
 * @public
 */
exports.login = catchAsync(async (req, res, next) => {
  try {
    const data = await authService.login(req.body);
    return res.json({ token: data.token, user: data.userTransformed });
  } catch (error) {
    return next(error);
  }
});

/**
 * Returns a new jwt when given a valid refresh token
 * @public
 */
exports.refresh = catchAsync(async (req, res, next) => {
  try {
    const data = await authService.refresh(req.body);
    return res.json(data);
  } catch (error) {
    return next(error);
  }
});

exports.sendPasswordReset = catchAsync(async (req, res, next) => {
  try {
    const isMailSent = await authService.sendPasswordReset(req.body);

    if (isMailSent) {
      res.status(httpStatus.OK);
      return res.json('success');
    }
    throw new APIError({
      status: httpStatus.UNAUTHORIZED,
      message: 'No account found with that email',
    });
  } catch (error) {
    return next(error);
  }
});

exports.resetPassword = catchAsync(async (req, res, next) => {
  try {
    const isPasswordReseted = await authService.resetPassword(req.body);
    if (isPasswordReseted) {
      res.status(httpStatus.OK).json('Password Updated');
    }
  } catch (error) {
    return next(error);
  }
});
