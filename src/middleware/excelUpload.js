const multer = require("multer");
const { randomBytes } = require("crypto");

const storage = multer.diskStorage({
  destination(req, file, cb) {
    cb(null, "uploads/");
  },
  filename(req, file, cb) {
    const suffix = Date.now() + "-" + randomBytes(4).toString("hex");
    cb(null, file.fieldname + "-" + suffix);
  },
});

const upload = multer({
  limits: {
    fileSize: 1000000,
  },
  fileFilter(req, file, cb) {
    if (!file.originalname.match(/\.(xlsx|xlsb|xls)$/)) {
      return cb(new Error("Invalid file format"));
    }
    cb(undefined, true);
  },
  storage,
});

module.exports = upload;
