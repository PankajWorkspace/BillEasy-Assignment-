const Book = require("../module/model/bookSchema");
const Review = require("../module/model/reviewSchema");
const User = require("../module/model/userSchema");

const generateID = async (type) => {
  if (type === "user") {
    const user = await User.findOne({ userId: { $exists: true, $ne: null } })
      .sort({ userId: -1 })
      .limit(1);

    console.log("Found user:", user);

    let nextUserId;

    if (user && user.userId) {
      const lastIdNumber = parseInt(user.userId.slice(4), 10);
      nextUserId = `User00${String(lastIdNumber + 1).padStart(2, "0")}`;
    } else {
      nextUserId = "User0001";
    }
  } else if (type === "book") {
    const book = await Book.findOne({ bookId: { $exists: true, $ne: null } })
      .sort({ bookId: -1 })
      .limit(1);

    let nextBookId;

    if (book && book.bookId) {
      const lastIdNumber = parseInt(book.bookId.slice(4), 10);
      nextBookId = `Book00${String(lastIdNumber + 1).padStart(2, "0")}`;
    } else {
      nextBookId = "Book0001";
    }
  } else if (type === "review") {
    const review = await Review.findOne({
      reviewId: { $exists: true, $ne: null },
    })
      .sort({ reviewId: -1 })
      .limit(1);

    let nextReviewId;

    if (review && review.reviewId) {
      const lastIdNumber = parseInt(review.reviewId.slice(4), 10);
      nextReviewId = `Review00${String(lastIdNumber + 1).padStart(2, "0")}`;
    } else {
      nextReviewId = "Review0001";
    }
  }
  return nextClientCode;
};

module.exports = generateID