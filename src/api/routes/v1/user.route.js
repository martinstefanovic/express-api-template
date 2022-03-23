/* ====================================
*                IMPORTS
======================================= */

const { validate } = require('express-validation');
const express = require('express');
const multer = require('multer');

/**
 * Custom imports
 */
const controller = require('../../controllers/user.controller');
const { authorize, ADMIN, LOGGED_USER } = require('../../middlewares/auth');
const parseJson = require('../../middlewares/parseJson');
const compressImages = require('./../../middlewares/compressImages');
const {
  listUsers,
  createUser,
  updateUser,
} = require('../../validations/user.validation');

/* ====================================
*                HELPERS
======================================= */

const router = express.Router();

const handleImageUpload = [
  multer({ storage: multer.memoryStorage() }).single('image'),
  compressImages('profileImages'),
  parseJson,
];

/* ====================================
*                ROUTES
======================================= */

/**
 * Load user when API with userId route parameter is hit
 */
router.param('userId', controller.load);

router
  .route('/')
  /**
   * @api {get} v1/users List Users
   * @apiDescription Get a list of users
   * @apiVersion 1.0.0
   * @apiName ListUsers
   * @apiGroup User
   * @apiPermission admin
   *
   * @apiHeader {String} Authorization   User's access token
   *
   * @apiParam  {Number{1-}}         [page=1]     List page
   * @apiParam  {Number{1-100}}      [perPage=1]  Users per page
   * @apiParam  {String}             [search]     User's name
   * @apiParam  {String=user,admin}  [role]       User's role
   * @apiParam  {String=name,email}  [sortBy]     Sort
   *
   * @apiSuccess {Object[]} users List of users.
   * @apiSuccessExample {json} Success-Response:
   * 200 OK
   *  {
          "pagination": {
              "perPage": 10,
              "totalPages": 1,
              "next": null,
              "prev": null,
              "count": 3
          },
          "data": [
              {
                  "id": "622f604f678819c8e6c441d8",
                  "name": "Administrator",
                  "email": "admin@admin.com",
                  "image": {
                      "filename": "avatar.png",
                      "path": "uploads/profileImages/avatar.webp"
                  },
                  "role": "admin",
                  "createdAt": "2022-03-14T15:33:35.987Z"
              }
          ]
      }
   * @apiError (Unauthorized 401)  Unauthorized  Only authenticated users can access the data
   * @apiError (Forbidden 403)     Forbidden     Only admins can access the data
   */
  .get(authorize(ADMIN), validate(listUsers, {}, {}), controller.list)
  /**
   * @api {post} v1/users Create User
   * @apiDescription Create a new user
   * @apiVersion 1.0.0
   * @apiName CreateUser
   * @apiGroup User
   * @apiPermission admin
   *
   * @apiHeader {String} Authorization   User's access token
   *
   * @apiBody   {String}             data.email           User's email
   * @apiBody   {String{..128}}      data.name            User's name
   * @apiBody   {String=user,admin}  data.role            User's role
   * @apiBody   {String}             data.password        User's password
   * @apiBody   {File}               [image]              Image will be compressed & converted to .webp format
   *
   * @apiSuccess (Created 201) {Object[]}  Object[]       User object
   *
   * @apiError (Bad Request 400)     ValidationError      Some parameters may contain invalid values
   * @apiError (Unauthorized 401)    Unauthorized         Only authenticated users can create the data
   * @apiError (Forbidden 403)       Forbidden            Only admins can create the data
   */
  .post(
    authorize(ADMIN),
    handleImageUpload,
    validate(createUser, {}, {}),
    controller.create
  );

router
  .route('/:userId')
  /**
   * @api {get} v1/users/:id Get User
   * @apiDescription Get user information
   * @apiVersion 1.0.0
   * @apiName GetUser
   * @apiGroup User
   * @apiPermission user
   *
   * @apiHeader {String} Authorization   User's access token
   *
   * @apiSuccess {Object[]}  id  User object
   * @apiSuccessExample {json} Success-Response:
    {
      "id": "622f604f678819c8e6c441d8",
      "name": "Administrator",
      "email": "admin@admin.com",
      "image": {
          "filename": "avatar.png",
          "path": "uploads/profileImages/avatar.webp"
      },
      "role": "admin",
      "createdAt": "2022-03-14T15:33:35.987Z"
    }
   *
   * @apiError (Unauthorized 401) Unauthorized Only authenticated users can access the data
   * @apiError (Forbidden 403)    Forbidden    Only user with same id or admins can access the data
   * @apiError (Not Found 404)    NotFound     User does not exist
   */
  .get(authorize(LOGGED_USER), controller.get)
  /**
   * @api {patch} v1/users/:id Update User
   * @apiDescription Update some fields of a user document
   * @apiVersion 1.0.0
   * @apiName UpdateUser
   * @apiGroup User
   * @apiPermission user
   *
   * @apiHeader {String} Authorization   User's access token
   *
   * @apiBody   {String}             [data.email]           User's email
   * @apiBody   {String{..128}}      [data.name]            User's name
   * @apiBody   {String=user,admin}  [data.role]            User's role
   * (You must be an admin to change the user's role)
   * @apiBody   {boolean}            [data.image.delete]    Set to true if you want to delete existing image
   *
   * @apiSuccess {Object[]}          Object[]                User object
   *
   * @apiError (Bad Request 400)  ValidationError  Some parameters may contain invalid values
   * @apiError (Unauthorized 401) Unauthorized     Only authenticated users can modify the data
   * @apiError (Forbidden 403)    Forbidden        Only user with same id or admins can modify the data
   * @apiError (Not Found 404)    NotFound         User does not exist
   */
  .patch(
    authorize(LOGGED_USER),
    handleImageUpload,
    validate(updateUser),
    controller.update
  )
  /**
   * @api {delete} v1/users/:id Delete User
   * @apiDescription Delete a user
   * @apiVersion 1.0.0
   * @apiName DeleteUser
   * @apiGroup User
   * @apiPermission user
   *
   * @apiHeader {String} Authorization   User's access token
   *
   * @apiSuccess (No Content 204)  Success Successfully deleted
   *
   * @apiError (Unauthorized 401) Unauthorized  Only authenticated users can delete the data
   * @apiError (Forbidden 403)    Forbidden     Only user with same id or admins can delete the data
   * @apiError (Not Found 404)    NotFound      User does not exist
   */
  .delete(authorize(LOGGED_USER), controller.delete);

module.exports = router;
