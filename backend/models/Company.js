const mongoose = require("mongoose");

const companySchema = new mongoose.Schema(
  {
    name: { type: String, required: true },
    industry: { type: String, default: "" },
    ownerAdminId: { type: mongoose.Schema.Types.ObjectId, ref: "User", default: null },
    createdBy: { type: mongoose.Schema.Types.ObjectId, ref: "User" }, // superadmin who created it
  },
  { timestamps: true }
);

module.exports = mongoose.model("Company", companySchema);
