const User = require("../model/userSchema");
const tokenService = require("../../service/token");
const generateID = require("../../service/generateId");

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

    const payload = {
      email: user?.email,
      mobileNumber: user?.mobileNumber,
      userId: user?.userId,
      name: user?.name,
      type: "user"
    }
    const token = await tokenService.generateToken(payload);
    user.token = token;

    await user.save();

    return res
      .status(200)
      .json({ message: "User logged in Succesfull", token: token });
  } catch (error) {
    console.error("Error during login:", error);
    return res.status(500).json({ message: "Server error" });
  }
};

exports.userSignup = async (req, res) => {
  const { emailId, password, mobileNumber, name } = req.body;

  try {
    let user = await User.findOne({ email: emailId });

    if (!user) {
      const id = await generateID("user")
      user = new User({
        name,
        email: emailId,
        password,
        mobileNumber,
        userId: id
      })

      await user.save();
      return res
        .status(200)
        .json({ message: "User signed up succesfully"});
    } else {
      return res.status(401).json({ message: "User already exist" });
    }
  } catch (error) {
    console.error("Error during login:", error);
    return res.status(500).json({ message: "Server error" });
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
      .json({ message: "User logged out succesfully"});
  } catch (error) {
    console.error("Error during logout:", error);
    return res.status(500).json({ message: "Server error" });
  }
};
