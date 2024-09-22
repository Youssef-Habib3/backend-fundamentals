const Course = require("../models/course.model");
const httpStatusText = require("../utils/httpStatusText");

const getAllCourses = async (req, res) => {
  try {
    const query = req.query;
    const limit = query.limit || 10;
    const page = query.page || 1;
    const skip = (page - 1) * limit;

    const courses = await Course.find({}, { __v: false })
      .limit(limit)
      .skip(skip);
    res.status(200).json({ status: httpStatusText.SUCCESS, data: { courses } });
  } catch (err) {
    return res.status(400).json({ status: httpStatusText.ERROR, message: err });
  }
};

const getACourse = async (req, res) => {
  try {
    const course = await Course.findById(req.params.courseId);

    if (!course) {
      return res
        .status(404)
        .json({ status: httpStatusText.FAIL, message: "Course not found" });
    }

    res.json({ status: httpStatusText.SUCCESS, data: { course } });
  } catch {
    return res
      .status(400)
      .json({ status: httpStatusText.FAIL, message: "Invalid Object Id" });
  }
};

const { validationResult } = require("express-validator");
const addACourse = async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res
        .status(400)
        .json({ status: httpStatusText.FAIL, data: errors.array() });
    }

    const newCourse = new Course(req.body);
    await newCourse.save();

    res
      .status(201)
      .json({ status: httpStatusText.SUCCESS, data: { course: newCourse } });
  } catch (err) {
    return res.status(400).json({ status: httpStatusText.ERROR, message: err });
  }
};

const updateACourse = async (req, res) => {
  try {
    const courseId = req.params.courseId;

    const course = await Course.findByIdAndUpdate(courseId, req.body);

    res.status(200).json({ status: httpStatusText.SUCCESS, data: { course } });
  } catch {
    return res
      .status(400)
      .json({ status: httpStatusText.FAIL, message: "Course Not Found" });
  }
};

const deleteACourse = async (req, res) => {
  try {
    const course = await Course.findByIdAndDelete(req.params.courseId);

    res.status(200).json({ status: httpStatusText.SUCCESS, data: null });
  } catch {
    return res
      .status(400)
      .json({ status: httpStatusText.FAIL, message: "Course Not Found" });
  }
};

module.exports = {
  getAllCourses,
  getACourse,
  addACourse,
  updateACourse,
  deleteACourse,
};
