const Project = require("../models/Project");

exports.getAll = async (req, res, next) => {
  try {
    const filter = {};
    if (req.query.category) filter.category = req.query.category;
    if (req.query.featured) filter.featured = req.query.featured === "true";
    const projects = await Project.find(filter).sort({ order: 1, createdAt: -1 });
    res.json({ success: true, count: projects.length, data: projects });
  } catch (err) {
    next(err);
  }
};

exports.getOne = async (req, res, next) => {
  try {
    const project = await Project.findOne({
      $or: [{ _id: /^[0-9a-fA-F]{24}$/.test(req.params.id) ? req.params.id : null }, { slug: req.params.id }]
    });
    if (!project) return res.status(404).json({ success: false, message: "Project not found." });
    res.json({ success: true, data: project });
  } catch (err) {
    next(err);
  }
};

exports.create = async (req, res, next) => {
  try {
    const project = await Project.create(req.body);
    res.status(201).json({ success: true, data: project });
  } catch (err) {
    next(err);
  }
};

exports.update = async (req, res, next) => {
  try {
    const project = await Project.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true
    });
    if (!project) return res.status(404).json({ success: false, message: "Project not found." });
    res.json({ success: true, data: project });
  } catch (err) {
    next(err);
  }
};

exports.remove = async (req, res, next) => {
  try {
    const project = await Project.findByIdAndDelete(req.params.id);
    if (!project) return res.status(404).json({ success: false, message: "Project not found." });
    res.json({ success: true, message: "Project deleted." });
  } catch (err) {
    next(err);
  }
};
