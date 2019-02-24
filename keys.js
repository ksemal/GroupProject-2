module.exports.nexmoKey = {
  apiKey: process.env.API_KEY,
  apiSecret: process.env.API_SECRET,
  nexmoNumber: process.env.NEXMO_NUM
};

module.exports.s3keys = {
  secretAccessKey: process.env.S3_SECRET,
  accessKeyId: process.env.S3_KEY,
  region: "us-east-1"
};
