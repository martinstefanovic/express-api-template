/* eslint-disable no-param-reassign */

const paginate = () => {
  return async function (filter, options) {
    let sort = '';
    console.log(options);
    if (options.sortBy) {
      const sortingCriteria = [];
      options.sortBy.split(',').forEach((sortOption) => {
        console.log(sortOption);
        const [key, order] = sortOption.split(':');
        sortingCriteria.push((order === 'desc' ? '-' : '') + key);
      });
      sort = sortingCriteria.join(' ');
    } else {
      sort = 'createdAt';
    }

    const limit =
      options.limit && parseInt(options.limit, 10) > 0
        ? parseInt(options.limit, 10)
        : 10;
    const page = parseInt(options.page) || 1;
    // const skip = (page - 1) * limit;
    const perPage = parseInt(options.perPage) || 10;
    const startIndex = (page - 1) * perPage;

    const countPromise = this.countDocuments(filter).exec();
    let docsPromise = this.find(filter)
      .sort(sort)
      .skip(startIndex)
      .limit(perPage);

    if (options.populate) {
      options.populate.split(',').forEach((populateOption) => {
        docsPromise = docsPromise.populate(
          populateOption
            .split('.')
            .reverse()
            .reduce((a, b) => ({ path: b, populate: a }))
        );
      });
    }

    docsPromise = docsPromise.exec();

    return Promise.all([countPromise, docsPromise]).then((values) => {
      const [totalResults, results] = values;
      const totalPages = Math.ceil(totalResults / perPage);
      const result = {
        data: results,
        pagination: {
          perPage,
          totalPages,
          count: totalResults,
          next: page + 1 <= Math.ceil(totalPages / perPage) ? page + 1 : null,
          prev: page - 1 > 0 ? page - 1 : null,
        },
      };
      return Promise.resolve(result);
    });
  };
};

module.exports = paginate;
