const sharp = require('sharp');
const fs = require('fs');

module.exports = compressImages = (path) => {
  return async (req, res, next) => {
    if (!req.file) {
      return next();
    }
    fs.access(`./uploads/${path}`, (error) => {
      if (error) {
        fs.mkdirSync(`./uploads/${path}`);
      }
    });

    // The logic goes here.
    const { buffer, originalname, size } = req.file;
    console.log(size / 1024);
    const quality = size / 1024 < 300 ? 20 : 70;
    const timestamp = +new Date();
    const ref = `${originalname
      .split('.')
      .slice(0, -1)
      .join('.')}-${timestamp}.webp`;
    // const ref2 = `${originalname
    //   .split('.')
    //   .slice(0, -1)
    //   .join('.')}-${timestamp}-200x200.webp`;
    req.file.path = `uploads/${path}/${ref}`;
    await sharp(buffer)
      .toFormat('webp')
      .webp({ quality: quality })
      .toFile(`./uploads/${path}/${ref}`);

    // await sharp(buffer)
    //   .toFormat('webp')
    //   .resize(200, 200, {
    //     fit: 'inside',
    //   })
    //   .webp({ quality: 90 })
    //   .toFile(`./uploads/${path}/${ref2}`);

    next();
  };
};
