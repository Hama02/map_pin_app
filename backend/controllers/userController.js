const User = require("../models/User");
const bcrypt = require("bcrypt");

exports.login = async (req, res) => {
  const { email, password } = req.body;
  if (!email || !password) {
    return res.status(400).json("Please provide email and password");
  }

  const user = await User.findOne({ email });
  if (!user || !(await bcrypt.compare(password, user.password))) {
    return res.status(400).json("Incorrect Password or Email");
  }
  res.status(200).json("Welcome Back !!");
};

exports.register = async (req, res) => {
  const salt = await bcrypt.genSalt(10);
  const hashedPassword = await bcrypt.hash(req.body.password, salt);

  const newUser = new User({
    username: req.body.username,
    email: req.body.email,
    password: hashedPassword,
  });

  try {
    await newUser.save();
    res.status(200).json("success");
  } catch (err) {
    res.status(500).json(err);
  }
};
