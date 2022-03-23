const express = require('express');
const morgan = require('morgan');
const compress = require('compression');
const methodOverride = require('method-override');
const cors = require('cors');
const helmet = require('helmet');
const passport = require('passport');
const routes = require('../api/routes/v1');
const { env } = require('./vars');
const strategies = require('./passport');
const error = require('../api/middlewares/error');
const fs = require('fs');

/**
 * Express instance
 * @public
 */
const app = express();

// request logging. dev: console | production: file
if (env === 'production') {
  // create a write stream (in append mode)
  var accessLogStream = fs.createWriteStream('access.log', {
    flags: 'a',
  });
  // setup the logger
  app.use(morgan('combined', { stream: accessLogStream }));
} else {
  app.use(morgan('dev'));
}

// parse body params and attache them to req.body
app.use(express.urlencoded({ extended: true }));
app.use(express.json());

// gzip compression
app.use(compress());

// Static folders
app.use(express.static('./uploads'));
app.use(express.static('./doc'));

// lets you use HTTP verbs such as PUT or DELETE
// in places where the client doesn't support it
app.use(methodOverride());

// secure apps by setting various HTTP headers
app.use(helmet());

// enable CORS - Cross Origin Resource Sharing
app.use(cors());

// enable authentication
app.use(passport.initialize());
passport.use('jwt', strategies.jwt);
// passport.use('facebook', strategies.facebook);
// passport.use('google', strategies.google);

// mount api v1 routes
app.use('/v1', routes);

// if error is not an instanceOf APIError, convert it.
app.use(error.converter);

// catch 404 and forward to error handler
app.use(error.notFound);

// error handler, send stacktrace only during development
app.use(error.handler);

module.exports = app;
