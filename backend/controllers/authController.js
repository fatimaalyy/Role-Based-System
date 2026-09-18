const jwt = require("jsonwebtoken");
const User = require("../models/User");
const Company = require("../models/Company");

const generateToken = (user) => {
  return jwt.sign(
    { id: user._id, role: user.role, companyId: user.companyId, shopId: user.shopId },
    process.env.JWT_SECRET,
    { expiresIn: process.env.JWT_EXPIRES_IN || "7d" }
  );
};

// @route POST /api/auth/register-superadmin  (run once to bootstrap the system)
const registerSuperAdmin = async (req, res) => {
  try {
    const { name, email, password } = req.body;
    const exists = await User.findOne({ role: "superadmin" });
    if (exists) return res.status(400).json({ message: "Super admin already exists" });

    const user = await User.create({ name, email, password, role: "superadmin" });
    res.status(201).json({ message: "Super admin created", token: generateToken(user) });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// @route POST /api/auth/login
const login = async (req, res) => {
  try {
    const { email, password } = req.body;
    const user = await User.findOne({ email });
    if (!user || !(await user.comparePassword(password))) {
      return res.status(401).json({ message: "Invalid email or password" });
    }

    res.json({
      token: generateToken(user),
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
        companyId: user.companyId,
        shopId: user.shopId,
      },
    });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// @route GET /api/auth/me
const getMe = async (req, res) => {
  res.json(req.user);
};

module.exports = { registerSuperAdmin, login, getMe };
