const Book = require("../model/bookSchema");
const Review = require("../model/reviewSchema");

exports.addOrUpdateReview = async(userId, bookId, reviewData) =>{
  try {
    // Check if review already exists for this user and book
    let review = await Review.findOne({ userId, bookId });

    if (review) {
      // Update existing review
      review.content = reviewData.content;
      review.comments = reviewData.comments;
      review.rating = reviewData.rating;
      await review.save();
      return { message: "Review updated", review };
    } else {
      // Create new review
      const newReview = await Review.create({ ...reviewData, userId, bookId });

      // Push new review to book
      await Book.findOneAndUpdate(
        { bookId },
        { $push: { reviews: newReview._id } }
      );

      return { message: "Review added", review: newReview };
    }
  } catch (err) {
    if (err.code === 11000) {
      return { error: "Review already exists" }; // Unique index violation
    }
    throw err;
  }
}


exports.deleteReview = async(userId, bookId) =>{
  const review = await Review.findOneAndDelete({ userId, bookId });
  if (review) {
    await Book.findOneAndUpdate(
      { bookId },
      { $pull: { reviews: review._id } }
    );
    return { message: "Review deleted" };
  } else {
    return { error: "No review found to delete" };
  }
}
