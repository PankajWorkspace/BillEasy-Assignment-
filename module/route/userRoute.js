const express = require("express");
const router = express.Router();
const { check, validationResult } = require("express-validator");
const User = require("../controller/UserController");
const { verifyToken } = require("../../service/token")

// Validation middlewares
const userSignUpValidation = () => {
  return [
    check("mobileNumber")
      .notEmpty()
      .withMessage("Mobile number is required")
      .isNumeric()
      .withMessage("Mobile number should be a number")
      .isLength({ min: 10, max: 10 })
      .withMessage("Mobile number must be exactly 10 digits long")
      .matches(/^[1-9][0-9]{9}$/)
      .withMessage("Mobile number should not start with 0"),
    check("emailId", "emailId is required").notEmpty(),
    check("password", "password is required").notEmpty(),
    check("name", "name is required").notEmpty(),
  ];
};

const userLogInValidation = () => {
  return [
    check("emailId", "emailId is required").notEmpty(),
    check("password", "password is required").notEmpty(),
  ];
};

const userLogOutValidation = () => {
  return [check("emailId", "emailId is required").notEmpty()];
};

router.post(
  "/login",
  userLogInValidation(),
  (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }
    next();
  },
  User.userLogin
);

router.post(
  "/signup",
  userSignUpValidation(),
  (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }
    next();
  },
  User.userSignup
);

router.post(
  "/logout",
  userLogOutValidation(),
//   verifyToken,
  (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }
    next();
  },
  User.userLogout
);

module.exports = router;
