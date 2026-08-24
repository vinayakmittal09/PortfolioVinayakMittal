require("dotenv").config();
const express = require("express");
const cors = require("cors");
const path = require("path");
const rateLimit = require("express-rate-limit");
const mongoose = require("mongoose");
const connectDB = require("./config/db");
const { notFound, errorHandler } = require("./middleware/errorHandler");
const ensureAdmin = require("./utils/ensureAdmin");

const app = express();

// --- Security / parsing middleware ---
const allowedOrigins = (process.env.CORS_ORIGIN || "").split(",").map(s => s.trim()).filter(Boolean);
app.use(cors({
  origin: allowedOrigins.length ? allowedOrigins : true,
  credentials: true
}));
app.use(express.json({ limit: "2mb" }));
app.use(express.urlencoded({ extended: true }));

const apiLimiter = rateLimit({ windowMs: 15 * 60 * 1000, max: 300 });
app.use("/api", apiLimiter);

const contactLimiter = rateLimit({ windowMs: 60 * 60 * 1000, max: 10, message: { success:false, message:"Too many messages sent. Please try again later." } });
app.use("/api/contact", contactLimiter);

// --- Static: uploaded media (local fallback storage) ---
app.use("/uploads", express.static(path.join(__dirname, "uploads")));

// --- API routes ---
app.use("/api/auth", require("./routes/authRoutes"));
app.use("/api/projects", require("./routes/projectRoutes"));
app.use("/api/categories", require("./routes/categoryRoutes"));
app.use("/api/testimonials", require("./routes/testimonialRoutes"));
app.use("/api/contact", require("./routes/contactRoutes"));
app.use("/api/upload", require("./routes/uploadRoutes"));

app.get("/api/health", (req, res) => {
  res.json({
    success: true,
    status: "ok",
    dbState: mongoose.connection.readyState // 1 = connected
  });
});

// --- Serve the frontend (client/) as static files ---
const clientDir = path.join(__dirname, "..", "client");
app.use(express.static(clientDir));

app.get("/admin", (req, res) => res.sendFile(path.join(clientDir, "admin.html")));

// Any other non-API GET request falls back to index.html-style routing
app.get(/^\/(?!api|uploads).*/, (req, res, next) => {
  const wanted = path.join(clientDir, req.path);
  res.sendFile(wanted, (err) => {
    if (err) res.sendFile(path.join(clientDir, "index.html"));
  });
});

app.use(notFound);
app.use(errorHandler);

const PORT = process.env.PORT || 3000;

async function start() {
  await connectDB();
  await ensureAdmin();
  app.listen(PORT, () => {
    console.log(`Server running on http://localhost:${PORT}`);
  });
}

start();

module.exports = app;
