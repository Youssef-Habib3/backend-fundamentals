const express = require("express");
const router = express.Router();
const coursesController = require("../controllers/courses.controllers");

const validationSchema = require("../middlewares/validationSchema");
const verifyToken = require("../middlewares/verifyToken");
const userRoles = require("../utils/roles");
const allowedTo = require("../middlewares/allowedTo");

router
  .route("/")
  .get(coursesController.getAllCourses)
  .post(
    verifyToken,
    allowedTo(userRoles.ADMIN, userRoles.MANAGER),
    validationSchema(),
    coursesController.addACourse
  );

router
  .route("/:courseId")
  .get(coursesController.getACourse)
  .patch(coursesController.updateACourse)
  .delete(
    // to delete a course i should be logedin
    verifyToken,
    // and to delete a course i should be an admin or a manager
    allowedTo(userRoles.ADMIN, userRoles.MANAGER),
    coursesController.deleteACourse
  );

module.exports = router;
