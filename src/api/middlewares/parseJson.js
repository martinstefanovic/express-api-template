module.exports = parseJson = (req, res, next) => {
  req.body = JSON.parse(req.body.data);

  return next();
};
