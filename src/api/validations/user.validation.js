const Joi = require('joi');
const User = require('../models/User.model');

module.exports = {
  // GET /v1/users
  listUsers: {
    query: Joi.object({
      page: Joi.number().min(1),
      perPage: Joi.number().min(1).max(100),
      search: Joi.string(),
      email: Joi.string(),
      role: Joi.string(),
      sortBy: Joi.string(),
    }),
  },

  // POST /v1/users
  createUser: {
    body: Joi.object({
      email: Joi.string().email().required(),
      password: Joi.string().min(6).max(128).required(),
      name: Joi.string().max(128),
      role: Joi.string().valid(...User.roles),
    }),
  },

  // PUT /v1/users/:userId
  replaceUser: {
    body: Joi.object({
      email: Joi.string().email().required(),
      password: Joi.string().min(6).max(128).required(),
      name: Joi.string().max(128),
      role: Joi.string(),
    }),
    params: {
      userId: Joi.string()
        .regex(/^[a-fA-F0-9]{24}$/)
        .required(),
    },
  },

  // PATCH /v1/users/:userId
  updateUser: {
    body: Joi.object({
      email: Joi.string().email().min(5),
      password: Joi.string().min(6).max(128),
      name: Joi.string().max(128),
      role: Joi.string(),
      image: Joi.any(),
    }),
    params: Joi.object({
      userId: Joi.string()
        .regex(/^[a-fA-F0-9]{24}$/)
        .required(),
    }),
  },
};
