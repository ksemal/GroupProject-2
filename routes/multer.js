var keys = require("../keys");
var moment = require("moment");
// Multer.js config for Disk storage. This package stores images as files on the server
// and serves them as static assets. More configuration can be done as needed, including
// only allowing specific file types / setting limits on file size etc..
// https://www.npmjs.com/package/multer

// amazon s3
var multer = require("multer");
var multerS3 = require("multer-s3");

var aws = require("aws-sdk");
aws.config.update(keys.s3keys);
var s3 = new aws.S3();

var upload = multer({
  storage: multerS3({
    s3: s3,
    bucket: "schedulr",
    key: function(req, file, cb) {
      cb(null, "images/" + moment().unix() + file.originalname); //use Date.now() for unique file keys
    }
  })
});

module.exports = upload;
