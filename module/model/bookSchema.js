const mongoose = require("mongoose");
const DB = require("../../dbConnect/dbConnect");

const bookSchema = new mongoose.Schema(
  {
    author: { type: String },
    genre: { type: String },
    title: { type: String },
    description: { type: String },
    content: { type: String },
    bookId: { type: String },
    rating: { type: String },
    reviews: [{ type: mongoose.Schema.Types.ObjectId, ref: "Review" }]
  },
  { timestamps: true }
);

module.exports = DB.model("Book", bookSchema);
