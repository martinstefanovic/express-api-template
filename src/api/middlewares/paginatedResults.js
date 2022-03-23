module.exports = paginatedResults = () => {
  return async (req, res, next) => {
    const page = parseInt(req.query.page) || 1;
    const perPage = parseInt(req.query.perPage) || 10;

    // const startIndex = (page - 1) * perPage;

    // Count all
    // const total = await model.countDocuments();

    const results = {};

    results.pagination = {
      perPage,
      totalPages: Math.ceil(res.locals.total / perPage),
      next: page + 1 <= Math.ceil(res.locals.total / perPage) ? page + 1 : null,
      prev: page - 1 > 0 ? page - 1 : null,
      count: res.locals.total,
    };

    try {
      // const data = await model.find().limit(perPage).skip(startIndex).exec();
      // const transformedData = data.map((data) => data.transform());
      results.data = res.locals.data;
      res.paginatedResults = results;
      next();
    } catch (e) {
      res.status(500).json({ message: e.message });
    }
  };
};
