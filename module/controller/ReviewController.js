const Book = require("../model/bookSchema");
const Review = require("../model/reviewSchema");
const User = require("../model/userSchema")
const { updateAverageRating } = require("../../service/utils/rating");
const generateID = require("../../service/generateId")

exports.addReview = async (req, res) => {
  const { content, comments, rating, userId } = req.body;
  const bookId = req.params.id; 

  try {
    const user = await User.findOne({ userId });
    const book = await Book.findOne({ bookId });

    if (!user || !book) {
      return res.status(404).json({ message: "User or Book not found" });
    }

    let review = await Review.findOne({ userId: user._id, bookId: book._id });

    if (review) {
      return res.status(400).json({ message: "Review already exists." });
    }

    const reviewData = {
      content,
      comments,
      rating,
      reviewId: await generateID("review"),
      userId: user._id,
      bookId: book._id,
    };

    const newReview = await Review.create(reviewData);

    book.reviews.push(newReview._id);
    await book.save();

    await updateAverageRating(newReview.bookId);

    res.status(201).json({ message: "Review added", review: newReview });

  } catch (err) {
    if (err.code === 11000) {
      return res.status(409).json({ error: "Duplicate review not allowed" });
    }
    console.error("Error adding review:", err);
    res.status(500).json({ error: "Server error" });
  }
};

exports.updateReview = async (req, res) => {
  const { content, comments, rating, userId } = req.body;
  const bookId = req.params.id; 
  
  try {
    let user = await User.findOne({userId})
    let book = await Book.findOne({bookId})
    let userMongoId = user._id
    let bookMongoId = book._id
    let review = await Review.findOne({ userId : userMongoId, bookId: bookMongoId });

    if (review) {
      review.content = content;
      review.comments = comments;
      review.rating = rating;

      await review.save();
      // Updating the reviews of the booking as soon as a new review is saved
      await updateAverageRating(bookMongoId);

      return res.status(200).json({ message: "Review updated", review });
    } else {
      return res.status(401).json({ message: "Review not found" });
    }
  } catch (err) {
    if (err.code === 11000) {
      return { error: "Review already exists" };
    }
    throw err;
  }
};

exports.deleteReview = async (req, res) => {
  const reviewId = req.params.id;

  try {
    const review = await Review.findOneAndDelete({ reviewId });

    if (!review) {
      return res.status(404).json({ error: "No review found to delete" });
    }

    await Book.findByIdAndUpdate(review.bookId, {
      $pull: { reviews: review._id },
    });

    await updateAverageRating(review.bookId);

    return res.status(200).json({ message: "Review deleted successfully" });

  } catch (err) {
    console.error("Error deleting review:", err);
    return res.status(500).json({ error: "Server error" });
  }
};
