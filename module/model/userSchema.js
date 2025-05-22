const mongoose = require("mongoose");
const DB = require("../../dbConnect/dbConnect");

const userSchema = new mongoose.Schema(
  {
    email: { type: String },
    name: { type: String },
    mobileNumber: { type: String },
    token: { type: String },
    password: { type: String },
    userId: { type: String },
  },
  { timestamps: true }
);

module.exports = DB.model("User", userSchema);
