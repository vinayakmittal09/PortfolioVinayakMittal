const jwt = require("jsonwebtoken");
const Admin = require("../models/Admin");

function signToken(admin) {
  return jwt.sign(
    { id: admin._id, email: admin.email },
    process.env.JWT_SECRET,
    { expiresIn: process.env.JWT_EXPIRES_IN || "7d" }
  );
}

exports.login = async (req, res, next) => {
  try {
    const { email, password } = req.body;
    if (!email || !password) {
      return res.status(400).json({ success: false, message: "Email and password are required." });
    }

    const admin = await Admin.findOne({ email: email.toLowerCase().trim() });
    if (!admin) {
      return res.status(401).json({ success: false, message: "Invalid credentials." });
    }

    const match = await admin.comparePassword(password);
    if (!match) {
      return res.status(401).json({ success: false, message: "Invalid credentials." });
    }

    const token = signToken(admin);
    res.json({ success: true, token, email: admin.email });
  } catch (err) {
    next(err);
  }
};
