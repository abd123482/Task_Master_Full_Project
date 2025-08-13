
const { TaskModel } = require("../models/taskModel");

const taskController = {
  async getAll(req, res) {
    const tasks = await TaskModel.getAll();
    res.json(tasks);
  },

  async getOne(req, res) {
    const task = await TaskModel.getById(req.params.id);
    if (!task) return res.status(404).json({ error: "Task not found" });
    res.json(task);
  },

  async create(req, res) {
    const task = req.body;
    if (!task.title || !task.deadline) {
      return res.status(400).json({ error: "Title and deadline are required" });
    }
    const created = await TaskModel.create(task);
    res.status(201).json(created);
  },

  async update(req, res) {
    const updated = await TaskModel.update(req.params.id, req.body);
    res.json(updated);
  },

  async delete(req, res) {
    await TaskModel.delete(req.params.id);
    res.json({ success: true });
  },
};

module.exports = taskController;
