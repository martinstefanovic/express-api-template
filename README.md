# README

## What is this?

Boilerplate/Generator/Starter Project for building RESTful APIs and microservices using Node.js, Express and MongoDB

## API Documentation

You can view [api documentation here](https://martinstefanovic.github.io/express-api-template/) or view how to generate docs below in "Getting started" section.

## Change log

Changelog is located in root folder in file CHANGELOG.md

## Features

- **NoSQL database**: [MongoDB](https://www.mongodb.com) object data modeling using [Mongoose](https://mongoosejs.com)
- **Authentication and authorization**: using [passport](http://www.passportjs.org)
- **Users management**: complete CRUD
- **Validation**: request data validation using [Joi](https://github.com/hapijs/joi)
- **Logging**: using [morgan](https://github.com/expressjs/morgan) and [winston](https://www.npmjs.com/package/winston)
- **Error handling**: centralized error handling mechanism
- **API documentation**: with [apidoc](https://apidocjs.com/)
- **Dependency management**: with [npm](https://www.npmjs.com/)
- **Environment variables**: using [dotenv](https://github.com/motdotla/dotenv)
- **Security**: set security HTTP headers using [helmet](https://helmetjs.github.io)
- **CORS**: Cross-Origin Resource-Sharing enabled using [cors](https://github.com/expressjs/cors)
- **File upload**: with [multer](https://www.npmjs.com/package/multer)
- **Compression**: gzip compression with [compression](https://github.com/expressjs/compression)
- **Image compression**: with [sharp](https://www.npmjs.com/package/sharp)
- **Linting**: with [Prettier](https://prettier.io)

## Requirements

- [Node v14+](https://nodejs.org/en/download/current/)
- [npm](https://www.npmjs.com/)

## Getting Started

#### Clone the repo and make it yours:

```bash
git clone --depth 1 https://martinstefanovic@bitbucket.org/itc-solution/nodejs-sandbox.git
cd nodejs-sandbox
rm -rf .git
```

#### Install dependencies:

```bash
npm i
```

#### Set environment variables:

```bash
cp .env.example .env
```

#### Running Locally

```bash
npm run dev
```

#### Running in Production

```bash
npm start
```

#### Generate documentation

```bash
# generate and open api documentation
npm run docs
# just open generated documentation
npm run open-docs
```

## License

[MIT License](README.md) - [Martin Stefanovic](https://github.com/martinstefanovic)
