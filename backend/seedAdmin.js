// Ye script sirf ek dafa chalani hai, superadmin account banane ke liye.
// Run: node seedAdmin.js  (backend folder ke andar se)

require("dotenv").config();
const mongoose = require("mongoose");
const User = require("./models/User");

// 👇 Yahan apna naam, email, password likh do
const ADMIN_NAME = "superadmin";
const ADMIN_EMAIL = "superadmin@admin.com";
const ADMIN_PASSWORD = "yourpassword123";

const seed = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI);
    console.log("✅ MongoDB connected");

    const existing = await User.findOne({ role: "superadmin" });
    if (existing) {
      console.log("⚠️  Super admin pehle se maujood hai:", existing.email);
      process.exit(0);
    }

    const admin = await User.create({
      name: ADMIN_NAME,
      email: ADMIN_EMAIL,
      password: ADMIN_PASSWORD,
      role: "superadmin",
    });

    console.log("🎉 Super admin ban gaya!");
    console.log("Email:", admin.email);
    console.log("Password:", ADMIN_PASSWORD, "(ye plain text sirf isi terminal mein dikhi, DB mein hashed hai)");
    process.exit(0);
  } catch (err) {
    console.error("❌ Error:", err.message);
    process.exit(1);
  }
};

seed();