const express = require("express");
const router = express.Router();
const { check, validationResult } = require("express-validator");
const Book = require("../controller/BookController");
const { verifyToken } = require("../../service/token");

const addBook = () => {
  return [
    check("author", "author is required").notEmpty(),
    check("genre", "genre is required").notEmpty(),
    check("title", "title is required").notEmpty(),
    check("description", "description is required").notEmpty(),
    check("content", "content is required").notEmpty(),
    check("bookId", "bookId is required").notEmpty(),
  ];
};

router.post(
  "/books",
  addBook(),
  verifyToken,
  (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }
    next();
  },
  Book.addBook
);

router.get("/books", Book.getBooks);

router.get("/books/:id", Book.getBookById);

router.get("/search", Book.searchBooks);

module.exports = router;
