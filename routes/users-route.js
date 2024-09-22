const express = require("express");
const router = express.Router();
const usersController = require("../controllers/users.controllers");
const verifyToken = require("../middlewares/verifyToken");

// to upload data
const multer = require("multer");
const diskStorage = multer.diskStorage({
  destination: function (req, file, cb) {
    console.log("file =>", file, "this is in 'users-route'");

    cb(null, "uploads");
  },
  filename: function (req, file, cb) {
    const ext = file.mimetype.split("/")[1];
    const filename = `user-${Date.now()}.${ext}`;
    cb(null, filename);
  },
});

const fileFilter = (req, file, cb) => {
  const imageType = file.mimetype.split("/")[0];

  if (imageType === "image") {
    return cb(null, true);
  } else {
    return cd(null, false);
  }
};
const upload = multer({ storage: diskStorage, fileFilter });

router.route("/").get(verifyToken, usersController.getAllUsers);

router
  .route("/register")
  .post(upload.single("avatar"), usersController.register);

router.route("/login").post(usersController.login);

module.exports = router;
