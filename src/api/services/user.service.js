const User = require('../models/User.model');
const httpStatus = require('http-status');
const deleteImage = require('../utils/deleteImage');
const { omit, assign } = require('lodash');

module.exports.getAll = async (filter, options) => {
  const users = await User.paginate(filter, options);
  return users;
};

module.exports.delete = async (req, res, next) => {
  const { user } = req.locals;
  deleteImage(req.locals.user.image);

  user
    .remove()
    .then(() => res.status(httpStatus.NO_CONTENT).end())
    .catch((err) => {
      next(err);
    });
};

module.exports.update = async (req, res, next) => {
  const data = req.body;

  /**
   * Check if user just delete image without adding new
   */
  if (data.image?.delete) {
    deleteImage(req.locals.user.image);
    data.image = null;
  }

  /**
   * Add image & delete exsisting
   */
  if (req.file) {
    deleteImage(req.locals.user.image);
    req.body.image = {
      filename: req.file.originalname,
      path: req.file.path,
    };
  }

  const ommitRole = req.locals.user.role !== 'admin' ? 'role' : '';
  const updatedUser = omit(data, ommitRole);
  const user = Object.assign(req.locals.user, updatedUser);

  return user;
};

module.exports.create = async (req) => {
  req.body.image = {
    filename: req.file.originalname,
    path: req.file.path,
    size: req.file.size,
  };

  const user = new User(req.body);
  const savedUser = await user.save();

  return savedUser.transform();
};
