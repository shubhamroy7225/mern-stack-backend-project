const multer = require("multer");
var storage = multer.diskStorage({
  limits: 500000,
  destination: function (req, file, cb) {
    cb(null, "public/assets");
  },
  filename: function (req, file, cb) {
    cb(null, Date.now() + "-" + file.originalname);
  },
});
var upload = multer({ storage: storage }).array("file");
module.exports = upload;
