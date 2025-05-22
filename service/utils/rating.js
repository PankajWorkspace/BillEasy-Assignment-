const Review = require("../../module/model/reviewSchema");
const Book = require("../../module/model/bookSchema");

exports.updateAverageRating = async (bookObjectId) => {
  try {
    const reviews = await Review.find({ bookId: bookObjectId }).select(
      "rating"
    );

    console.log(reviews)

    const validRatings = reviews
      .map((r) => r.rating)
      .filter((r) => typeof r === "number" && !isNaN(r));

    if (validRatings.length === 0) {
      await Book.findByIdAndUpdate(bookObjectId, { averageRating: 0 });
      return;
    }

    const total = validRatings.reduce((sum, rating) => sum + rating, 0);
    const avg = total / validRatings.length;

    await Book.findByIdAndUpdate(bookObjectId, {
      averageRating: parseFloat(avg.toFixed(2)),
    });
  } catch (error) {
    console.error("Error updating average rating:", error);
  }
};
