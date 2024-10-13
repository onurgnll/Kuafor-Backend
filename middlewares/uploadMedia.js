const multer = require("multer");
const CustomError = require("../errors/CustomError");


exports.uploadMedia = (name) => (req, res, next) => {
  const upload = multer({
    storage: multer.memoryStorage(),
    fileFilter: (req, file, cb) => {
      if (
        file.mimetype == "image/png" ||
        file.mimetype == "image/jpg" ||
        file.mimetype == "image/jpeg" ||
        file.mimetype.includes("video") ||
        file.mimetype == "application/json"
      ) {
        cb(null, true);
      } else {
        req.fileValidationError = "goes wrong on the mimetype";
        return next(new CustomError("Unsupported File Type",-2))

      }
    },
  }).single(name);

  upload(req, res, (err) => {
    if (req.fileValidationError) {
      return res.send(req.fileValidationError);
    }
    return next();
  });
};

exports.uploadMultipleMedia = ({name, count}) => (req, res, next) => {
  const upload = multer({
    storage: multer.memoryStorage(),
    fileFilter: (req, file, cb) => {
      if (
        file.mimetype == "image/png" ||
        file.mimetype == "image/jpg" ||
        file.mimetype == "image/jpeg" ||
        file.mimetype == "application/pdf" ||
        // file.mimetype.includes("video") ||   video da yukleyebilecekler mi?
        file.mimetype == "application/json"
      ) {
        cb(null, true);
      } else {
        req.fileValidationError = "goes wrong on the mimetype";
        return cb(null, false, new Error("goes wrong on the mimetype"));
      }
    },
  }).fields([{name: name, maxCount: count}]);

  upload(req, res, (err) => {
    if (req.fileValidationError) {
      return res.send(req.fileValidationError);
    }
    return next();
  });
};