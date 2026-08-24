const mongoose = require("mongoose");

const categorySchema = new mongoose.Schema(
  {
    name: { type: String, required: true, trim: true, unique: true },
    slug: { type: String, required: true, unique: true, lowercase: true, trim: true }
  },
  { timestamps: true }
);

categorySchema.pre("validate", function (next) {
  if (!this.slug && this.name) {
    this.slug = this.name.toLowerCase().trim().replace(/[^a-z0-9]+/g, "-");
  }
  next();
});

module.exports = mongoose.model("Category", categorySchema);
