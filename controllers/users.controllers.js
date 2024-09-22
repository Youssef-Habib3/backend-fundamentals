const User = require("../models/user.model");
const generateJWT = require("../utils/generate.JWT");
const httpStatusText = require("../utils/httpStatusText");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");

const getAllUsers = async (req, res) => {
  try {
    const query = req.query;
    const limit = query.limit || 10;
    const page = query.page || 1;
    const skip = (page - 1) * limit;
    const users = await User.find({}, { __v: false, password: false })
      .limit(limit)
      .skip(skip);

    res.status(200).json({ status: httpStatusText.SUCCESS, data: { users } });
  } catch (err) {
    return res.status(400).json({ status: httpStatusText.ERROR, message: err });
  }
};

const register = async (req, res) => {
  try {
    const { firstName, lastName, email, password, role } = req.body;

    const oldUser = await User.findOne({ email });
    if (oldUser) {
      return res.status(400).json({
        status: httpStatusText.FAIL,
        data: { message: "User Already Exist. Please Login" },
      });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const newUser = new User({
      firstName,
      lastName,
      email,
      password: hashedPassword,
      role,
      avatar: req.file.filename,
    });

    const token = await generateJWT({
      email: newUser.email,
      id: newUser._id,
      role: newUser.role,
    });

    newUser.token = token;

    await newUser.save();

    res
      .status(201)
      .json({ status: httpStatusText.SUCCESS, data: { user: newUser } });
  } catch (err) {
    return res.status(400).json({ status: httpStatusText.ERROR, message: err });
  }
};

const login = async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({
        status: httpStatusText.FAIL,
        data: { message: "Please provide email and password" },
      });
    }

    const user = await User.findOne({ email });

    if (!user) {
      return res.status(400).json({
        status: httpStatusText.FAIL,
        data: { message: "User does not exist. Please register" },
      });
    }

    const comparedPassword = await bcrypt.compare(password, user.password);
    if (!comparedPassword) {
      return res.status(400).json({
        status: httpStatusText.FAIL,
        data: { message: "Incorrect password. Please try again" },
      });
    }

    if (user && comparedPassword) {
      const token = await generateJWT({
        email: user.email,
        id: user._id,
        role: user.role,
      });

      return res.status(200).json({
        status: httpStatusText.SUCCESS,
        data: { token },
      });
    } else {
      return res.status(400).json({
        status: httpStatusText.FAIL,
        data: { message: "something went wrong" },
      });
    }
  } catch (err) {
    return res
      .status(400)
      .json({ status: httpStatusText.ERROR, data: { message: err } });
  }
};

module.exports = {
  getAllUsers,
  register,
  login,
};
