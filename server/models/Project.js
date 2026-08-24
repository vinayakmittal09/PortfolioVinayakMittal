const mongoose = require("mongoose");

const mediaSchema = new mongoose.Schema(
  {
    type: { type: String, enum: ["image", "video"], default: "image" },
    url: { type: String, required: true },
    thumbnail: { type: String },
    alt: { type: String, default: "" },
    order: { type: Number, default: 0 }
  },
  { _id: false }
);

const projectSchema = new mongoose.Schema(
  {
    title: { type: String, required: true, trim: true },
    slug: { type: String, required: true, unique: true, lowercase: true, trim: true },
    category: {
      type: String,
      required: true,
      enum: ["photography", "videography", "editing", "design"]
    },
    year: { type: Number, required: true },
    location: { type: String, trim: true, default: "" },
    description: { type: String, trim: true, default: "" },
    creativeDirection: { type: String, trim: true, default: "" },
    coverImage: { type: String, default: "" },
    gallery: { type: [mediaSchema], default: [] },
    featured: { type: Boolean, default: false },
    order: { type: Number, default: 0 }
  },
  { timestamps: true }
);

projectSchema.pre("validate", function (next) {
  if (!this.slug && this.title) {
    this.slug = this.title
      .toLowerCase()
      .trim()
      .replace(/[^a-z0-9]+/g, "-")
      .replace(/(^-|-$)/g, "");
  }
  next();
});

module.exports = mongoose.model("Project", projectSchema);
