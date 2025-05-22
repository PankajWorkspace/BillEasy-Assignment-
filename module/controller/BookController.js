const Book = require("../model/bookSchema");
const Review = require("../model/reviewSchema");

exports.addBook = async (req, res) => {
  try {
    const { title, author, genre, description, content, bookId, rating } =
      req.body;

    const existing = await Book.findOne({ bookId });
    if (existing) {
      return res
        .status(400)
        .json({ error: "Book with this bookId already exists" });
    }

    // Create new book
    const newBook = new Book({
      title,
      author,
      genre,
      description,
      content,
      bookId,
      rating,
    });

    await newBook.save();

    res.status(201).json({ message: "Book added successfully", book: newBook });
  } catch (error) {
    console.error("Error adding book:", error);
    res.status(500).json({ error: "Server error" });
  }
};

exports.getBookById = async (req, res) => {
  try {
    const bookId = req.params.id;

    // Get pagination info from query string
    const page = parseInt(req.query.page) || 1;
    const limit = 5;
    const skip = (page - 1) * limit;

    // Step 1: Find the book
    const book = await Book.findById(bookId);

    if (!book) {
      return res.status(404).json({ error: "Book not found" });
    }

    // Step 2: Get paginated reviews for this book
    const reviews = await Review.find({ _id: { $in: book.reviews } })
      .skip(skip)
      .limit(limit)
      .sort({ createdAt: -1 })

    // Step 3: Get total count of reviews
    const totalReviews = await Review.countDocuments({ _id: { $in: book.reviews } });

    res.status(200).json({
      book: {
        ...book.toObject(),
        reviews, // override with paginated reviews
      },
      pagination: {
        page,
        limit,
        totalReviews,
        totalPages: Math.ceil(totalReviews / limit),
      },
    });
  } catch (error) {
    console.error("Error fetching book by ID:", error);
    res.status(500).json({ error: "Server error" });
  }
};

exports.searchBooks = async(req, res) => {
  try {
    const query = req.query.q;

    if (!query) {
      return res.status(400).json({ error: "Search query is required." });
    }

    // Regex is used for partial & case-insensitive match
    // mention in the assignment
    const searchRegex = new RegExp(query, "i");

    const books = await Book.find({
      $or: [
        { title: { $regex: searchRegex } },
        { author: { $regex: searchRegex } },
      ],
    }).populate("reviews");

    res.status(200).json({ results: books });
  } catch (error) {
    console.error("Error searching books:", error);
    res.status(500).json({ error: "Server error" });
  }
}

module.exports = { searchBooks };
