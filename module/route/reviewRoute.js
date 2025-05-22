const express = require("express");
const router = express.Router();
const { check, validationResult } = require("express-validator");
const Review = require("../controller/ReviewController");
const { verifyToken } = require("../../service/token");

router.use(verifyToken);

// Validation middlewares
const addorUpdateReviewValidation = () => {
  return [
    check("content", "content is required").notEmpty(),
    check("userId", "userId is required").notEmpty(),
    check("rating", "rating is required").notEmpty(),
  ];
};

const reviewValidation = () => {
  return [
    check("userId", "userId is required").notEmpty(),
  ];
};

router.post(
  "/books/:id/reviews",
  addorUpdateReviewValidation(),
  (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }
    next();
  },
  Review.addReview
);

router.put(
  "/reviews/:id",
  addorUpdateReviewValidation(),
  (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }
    next();
  },
  Review.updateReview
);

router.delete(
  "/reviews/:id",
  reviewValidation(),
  (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }
    next();
  },
  Review.deleteReview
);

module.exports = router;
