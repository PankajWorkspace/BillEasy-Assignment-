const mongoose = require("mongoose");
const DB = require("../../dbConnect/dbConnect");

const reviewSchema = new mongoose.Schema(
  {
    comments: { type: String },
    userId: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
    bookId: { type: mongoose.Schema.Types.ObjectId, ref: "Book" },
    content: { type: String },
    reviewId: { type: String },
    rating: { type: Number },
  },
  { timestamps: true }
);

// Add unique compound index on userId & bookId
//so that only one user can add one review on one book only
reviewSchema.index({ userId: 1, bookId: 1 }, { unique: true });

module.exports = DB.model("Review", reviewSchema);
