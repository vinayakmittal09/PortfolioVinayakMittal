const Contact = require("../models/Contact");

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

exports.create = async (req, res, next) => {
  try {
    const { name, email, projectType, budget, message } = req.body;

    if (!name || name.trim().length < 2) {
      return res.status(400).json({ success: false, message: "Please provide your name." });
    }
    if (!email || !EMAIL_RE.test(email)) {
      return res.status(400).json({ success: false, message: "Please provide a valid email address." });
    }
    if (!message || message.trim().length < 10) {
      return res.status(400).json({ success: false, message: "Please provide a message of at least 10 characters." });
    }

    const contact = await Contact.create({ name, email, projectType, budget, message });
    res.status(201).json({ success: true, message: "Message received.", data: contact });
  } catch (err) {
    next(err);
  }
};

exports.getAll = async (req, res, next) => {
  try {
    const messages = await Contact.find().sort({ createdAt: -1 });
    res.json({ success: true, count: messages.length, data: messages });
  } catch (err) {
    next(err);
  }
};

exports.update = async (req, res, next) => {
  try {
    const contact = await Contact.findByIdAndUpdate(req.params.id, req.body, { new: true });
    if (!contact) return res.status(404).json({ success: false, message: "Message not found." });
    res.json({ success: true, data: contact });
  } catch (err) {
    next(err);
  }
};

exports.remove = async (req, res, next) => {
  try {
    const contact = await Contact.findByIdAndDelete(req.params.id);
    if (!contact) return res.status(404).json({ success: false, message: "Message not found." });
    res.json({ success: true, message: "Message deleted." });
  } catch (err) {
    next(err);
  }
};
