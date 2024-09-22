const express = require("express");
const app = express();
const httpStatusText = require("./utils/httpStatusText");
const path = require("node:path");

require("dotenv").config();

// to appear avatar image
app.use("/uploads", express.static(path.join(__dirname, "uploads")));

const mongoose = require("mongoose");
const url = process.env.MONGO_URL;
mongoose.connect(url).then(() => console.log("MongoDB connected"));

app.use(express.json());

const coursesRouter = require("./routes/courses-route");
const usersRouter = require("./routes/users-route");

app.use("/api/courses", coursesRouter);
app.use("/api/users", usersRouter);

app.all("*", (req, res) => {
  res.status(404).json({
    status: httpStatusText.ERROR,
    data: {
      message: "This recourse is not available",
    },
  });
});

app.listen(process.env.PORT || 3001, () => {
  console.log("Listening on port 3001");
});
