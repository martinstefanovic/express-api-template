const User = require('../models/User.model');
const httpStatus = require('http-status');
const pick = require('../utils/pick');
const catchAsync = require('../utils/catchAsync');
const { userService } = require('../services');
const logger = require('./../../config/logger');

/**
 * Load user and append to req.
 * @public
 */
exports.load = async (req, res, next, id) => {
  try {
    const user = await User.get(id);
    req.locals = { user };
    return next();
  } catch (error) {
    return next(error);
  }
};

exports.get = (req, res) => res.json(req.locals.user.transform());

exports.update = catchAsync(async (req, res, next) => {
  const user = await userService.update(req, res, next);

  user
    .save()
    .then((savedUser) => res.json(savedUser.transform()))
    .catch((e) => next(User.checkDuplicateEmail(e)));
});

exports.create = catchAsync(async (req, res, next) => {
  try {
    const savedUser = await userService.create(req);
    res.status(httpStatus.CREATED).json(savedUser);
  } catch (error) {
    next(User.checkDuplicateEmail(error));
  }
});

exports.list = catchAsync(async (req, res, next) => {
  /**
   * If you want to extract filter parameters from req:
   * const filter = pick(req.query, ['email','role']);
   * This will generate object
   * {
   *  email: 'john...',
   *  role: 'admin'
   * }
   */

  const filter = req.query?.search
    ? {
        $or: [{ name: { $regex: req.query?.search, $options: 'i' } }],
      }
    : {};
  const options = pick(req.query, ['perPage', 'page', 'sortBy']);
  const result = await userService.getAll(filter, options);
  res.send(result);
});

exports.delete = catchAsync((req, res, next) => {
  userService.delete(req, res, next);
});
