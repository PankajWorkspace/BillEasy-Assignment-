const Book = require("../module/model/bookSchema");
const Review = require("../module/model/reviewSchema");
const User = require("../module/model/userSchema");

const generateID = async (type) => {
  let id;

  const modelMap = {
    user: { model: User, prefix: "User" },
    book: { model: Book, prefix: "Book" },
    review: { model: Review, prefix: "Review" },
  };

  const config = modelMap[type];
  if (!config) throw new Error("Invalid type for ID generation");

  const latest = await config.model
    .findOne({ [`${type}Id`]: { $exists: true, $ne: null } })
    .sort({ [`${type}Id`]: -1 })
    .limit(1);

  let lastIdNumber = 0;

  if (latest && latest[`${type}Id`]) {
    const match = latest[`${type}Id`].match(/\d+$/);
    if (match) {
      lastIdNumber = parseInt(match[0], 10);
    }
  }

  id = `${config.prefix}${String(lastIdNumber + 1).padStart(4, "0")}`;
  return id;
};


module.exports = generateID