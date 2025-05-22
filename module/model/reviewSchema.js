const mongoose = require("mongoose");
const DB = require("../../dbConnect/dbConnect");

const reviewSchema = new mongoose.Schema(
  {
    comments: { type: String },
    userId: { type: String },
    bookId: { type: String },
    content: { type: String },
    reviewId: { type: String },
  },
  { timestamps: true }
);

// Add unique compound index on userId & bookId
//so that only one user can add one review on one book only
reviewSchema.index({ userId: 1, bookId: 1 }, { unique: true });

module.exports = DB.model("Review", reviewSchema);
