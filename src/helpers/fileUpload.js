const multer = require('multer');
const path = require('path');

const { response } = require("../helpers/response");

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, path.join(process.cwd(), "public", "pictures"));
  },
  filename: function (req, file, cb) {
    const ext = file.originalname.split(".")[1];
    const date = new Date();
    cb(null, `${date.getTime()}.${ext}`);
  }
});

const upload = multer({
  storage,
  limits: { fileSize: 1024 * 1024 * 2 },
  fileFilter: (req, file, callback) => {
    const mimitype = path.extname(file.originalname);
    if (mimitype !== ".png" && mimitype !== ".jpg" && mimitype !== ".jpeg") {
      return callback(new Error("Only pictures are allowed!"));
    }
    callback(null, true);
  }
}).single("pictures");

const fileUpload = (req, res, next) => {
  upload(req, res, (err) => {
    if (err instanceof multer.MulterError) {
      return response(res, 400, err.message);
    }
    else if (err) {
      return response(res, 400, err.message);
    }
    next();
  });
};
module.exports = fileUpload;