const { v2: cloudinary } = require("cloudinary");
const vars = require("./conf");

cloudinary.config({
  cloud_name: vars.cloud_name,
  api_key: vars.cloudinary_api_key,
  api_secret: vars.cloudinary_api_secret,
});

// console.log(cloudinary.config());

module.exports = cloudinary;