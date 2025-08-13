
const express = require("express");
const router = express.Router();
let tasks = [];
router.get("/", (req, res) => {
  res.json(tasks);
});
router.post("/", (req, res) => {
  tasks.push(req.body);
  res.status(201).json(req.body);
});
router.put("/:id", (req, res) => {
  const id = parseInt(req.params.id);
  if (id >= 0 && id < tasks.length) {
    tasks[id] = req.body;
    res.json(req.body);
  } else {
    res.status(404).json({ error: "Task not found" });
  }
});
router.delete("/:id", (req, res) => {
  const id = parseInt(req.params.id);
  if (id >= 0 && id < tasks.length) {
    tasks = tasks.filter((_, index) => index !== id);
    res.status(204).end();
  } else {
    res.status(404).json({ error: "Task not found" });
  }
});

module.exports = router;
