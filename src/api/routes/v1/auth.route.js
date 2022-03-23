const express = require('express');
const router = express.Router();
const controller = require('../../controllers/auth.controller');
const { validate } = require('express-validation');
const {
  login,
  register,
  oAuth,
  refresh,
  sendPasswordReset,
  passwordReset,
} = require('../../validations/auth.validation');

/**
 * @api {post} v1/auth/register Register
 * @apiDescription Register a new user
 * @apiVersion 1.0.0
 * @apiName Register
 * @apiGroup Auth
 * @apiPermission public
 *
 * @apiBody  {String}          email     User's email
 * @apiBody  {String{6..128}}  password  User's password
 *
 * @apiSuccessExample {json} Success-Response:
    {
        "token": {
            "tokenType": "Bearer",
            "accessToken": "eyJ0eXAiOiJKV1...",
            "refreshToken": "622f604f67881...",
            "expiresIn": "2022-03-23T06:46:41.130Z"
        },
        "user": {
            "id": "622f604f678819c8e6c441d8",
            "name": "Administrator",
            "email": "admin@admin.com",
            "image": {
                "filename": "avatar.png",
                "path": "uploads/profileImages/avatar-1647947600371.webp"
            },
            "role": "admin",
            "createdAt": "2022-03-14T15:33:35.987Z"
        }
    }
 *
 * @apiError (Bad Request 400)  ValidationError  Some parameters may contain invalid values
 */
router.route('/register').post(controller.register);
/**
 * @api {post} v1/auth/login Login
 * @apiDescription Get an accessToken
 * @apiVersion 1.0.0
 * @apiName Login
 * @apiGroup Auth
 * @apiPermission public
 *
 * @apiBody  {String}         email     User's email
 * @apiBody  {String{..128}}  password  User's password
 *
 * @apiSuccess  {Object[]}  Object[]     Same object as on register route
 *
 * @apiError (Bad Request 400)  ValidationError  Some parameters may contain invalid values
 * @apiError (Unauthorized 401)  Unauthorized     Incorrect email or password
 */
router.route('/login').post(validate(login, {}, {}), controller.login);
/**
 * @api {post} v1/auth/refresh-token Refresh Token
 * @apiDescription Refresh expired accessToken
 * @apiVersion 1.0.0
 * @apiName RefreshToken
 * @apiGroup Auth
 * @apiPermission public
 *
 * @apiBody  {String}  email         User's email
 * @apiBody  {String}  refreshToken  Refresh token aquired when user logged in
 *
 * @apiSuccess {String}  tokenType     Access Token's type
 * @apiSuccess {String}  accessToken   Authorization Token
 * @apiSuccess {String}  refreshToken  Token to get a new accessToken after expiration time
 * @apiSuccess {Number}  expiresIn     Access Token's expiration time in miliseconds
 *
 * @apiError (Bad Request 400)  ValidationError  Some parameters may contain invalid values
 * @apiError (Unauthorized 401)  Unauthorized     Incorrect email or refreshToken
 */
router
  .route('/refresh-token')
  .post(validate(refresh, {}, {}), controller.refresh);
/**
 * Reset password
 */
router
  .route('/send-password-reset')
  .post(validate(sendPasswordReset), controller.sendPasswordReset);

module.exports = router;
