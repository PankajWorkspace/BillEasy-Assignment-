const mongoose = require("mongoose");
require("dotenv").config();

const dbUrl = process.env.MONGO_URL;

const book = mongoose.createConnection(`${dbUrl}/bookReview`, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

book.on("error", console.error.bind(console, "DataBase connection error:"));

book.once("open", () => {
  console.log(`Connected to DataBase`);
});

book.once("close", () => {
  console.log(`Disconnected from DataBase`);
});

module.exports = book;
