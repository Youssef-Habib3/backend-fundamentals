const { body } = require("express-validator");

const validationSchema = () => {
  return (
    body("title")
      .notEmpty()
      .withMessage("Title is required")
      .isLength({ min: 3 })
      .withMessage("Title must be at least 3 characters long"),
    body("price").notEmpty().withMessage("Price is required")
  );
};

module.exports = validationSchema;
