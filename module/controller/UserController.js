const User = require("../model/userSchema");
const tokenService = require("../../service/token");
const generateID = require("../../service/generateId");

// Exporting the login function directly
exports.userLogin = async (req, res) => {
  const { emailId, password } = req.body;

  try {
    let user = await User.findOne({ email: emailId });

    if (!user) {
      return res
        .status(400)
        .json({ message: "User not found. Please create a user first" });
    }

    if (user.password !== password) {
      return res.status(401).json({ message: "Incorrect Credentials" });
    }

    const token = tokenService.generateToken();
    user.token = token;

    await user.save();

    return res
      .status(200)
      .json({ message: "User logged in Succesfull", token: token });
  } catch (error) {
    console.error("Error during login:", error);
    return res.status(500).json({message: "Server error"});
  }
};

exports.userLogout = async (req, res) => {
  const { emailId } = req.body;

  try {
    let user = await User.findOne({ email: emailId });

    if (!user) {
      return res
        .status(400)
        .json({ message: "User not found. Please create a user first" });
    }

    user.token = null;
    await user.save();

    return res
      .status(200)
      .json({ message: "User logged out Succesfull", token: token });
  } catch (error) {
    console.error("Error during logout:", error);
    return res.status(500).json({message: "Server error"});
  }
};
