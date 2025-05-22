const Book = require("../model/bookSchema");
const Review = require("../model/reviewSchema");

exports.addBook = async (req, res) => {
  try {
    const { title, author, genre, description, content, bookId } =
      req.body;

    const existing = await Book.findOne({ bookId });
    // if (existing) {
    //   return res
    //     .status(400)
    //     .json({ error: "Book with this bookId already exists" });
    // }

    // Create new book
    const newBook = new Book({
      title,
      author,
      genre,
      description,
      content,
      bookId,
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

    const page = parseInt(req.query.page) || 1;
    const limit = 5;
    const skip = (page - 1) * limit;

    const book = await Book.find({ bookId });

    if (!book) {
      return res.status(404).json({ error: "Book not found" });
    }

    const reviews = await Review.find({ _id: { $in: book.reviews } })
      .skip(skip)
      .limit(limit)
      .sort({ createdAt: -1 });

    const totalReviews = await Review.countDocuments({
      _id: { $in: book.reviews },
    });

    res.status(200).json({
      book: {
        ...book,
        reviews,
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

exports.getBooks = async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 2; // Default 10 books per page
    const skip = (page - 1) * limit;

    // Optional filters mention in the assignment
    const filter = {};
    if (req.query.author) {
      filter.author = req.query.author;
    }
    if (req.query.genre) {
      filter.genre = req.query.genre;
    }

    const totalBooks = await Book.countDocuments(filter);

    const books = await Book.find(filter)
      .skip(skip)
      .limit(limit)
      .populate({
        path: "reviews",
        options: { limit: 5, sort: { createdAt: -1 } }, // latest 5 reviews
      })
      .sort({ createdAt: -1 });

    res.status(200).json({
      books,
      pagination: {
        page,
        limit,
        totalBooks,
        totalPages: Math.ceil(totalBooks / limit),
      },
    });
  } catch (error) {
    console.error("Error fetching books:", error);
    res.status(500).json({ error: "Server error" });
  }
};

exports.searchBooks = async (req, res) => {
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

    if(books.length <= 0 ){
      return res.status(200).json({message: "No book found for this author or title"})
    }

    res.status(200).json({ results: books });
  } catch (error) {
    console.error("Error searching books:", error);
    res.status(500).json({ error: "Server error" });
  }
};
