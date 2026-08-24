const mongoose = require("mongoose");

const testimonialSchema = new mongoose.Schema(
  {
    quote: { type: String, required: true, trim: true },
    name: { type: String, required: true, trim: true },
    role: { type: String, trim: true, default: "" },
    avatar: { type: String, default: "" },
    order: { type: Number, default: 0 }
  },
  { timestamps: true }
);

module.exports = mongoose.model("Testimonial", testimonialSchema);
