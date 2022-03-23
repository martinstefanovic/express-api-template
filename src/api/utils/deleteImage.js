const fs = require('fs');
const logger = require('../../config/logger');

const deleteImage = (imageObject) => {
  imageObject?.path && fs.unlink(imageObject.path, (err) => logger.error(err));
};

module.exports = deleteImage;
