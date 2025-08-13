
class Task {
  constructor(id, title, description, deadline, priority, status) {
    this.id = id;
    this.title = title;
    this.description = description;
    this.deadline = deadline;
    this.priority = priority;
    this.status = status;
  }
}

const db = require("../config/db");

const TaskModel = {
  async getAll() {
    const [rows] = await db.query("SELECT * FROM tasks ORDER BY created_at DESC");
    return rows.map(t => new Task(t.id, t.title, t.description, t.deadline, t.priority, t.status));
  },

  async getById(id) {
    const [rows] = await db.query("SELECT * FROM tasks WHERE id = ?", [id]);
    if (rows.length === 0) return null;
    const t = rows[0];
    return new Task(t.id, t.title, t.description, t.deadline, t.priority, t.status);
  },

  async create(task) {
    const { title, description, deadline, priority, status } = task;
    const [result] = await db.query(
      "INSERT INTO tasks (title, description, deadline, priority, status) VALUES (?, ?, ?, ?, ?)",
      [title, description, deadline, priority, status]
    );
    return { id: result.insertId, ...task };
  },

  async update(id, task) {
    const { title, description, deadline, priority, status } = task;
    await db.query(
      "UPDATE tasks SET title = ?, description = ?, deadline = ?, priority = ?, status = ? WHERE id = ?",
      [title, description, deadline, priority, status, id]
    );
    return { id, ...task };
  },

  async delete(id) {
    await db.query("DELETE FROM tasks WHERE id = ?", [id]);
    return { success: true };
  },
};

module.exports = { Task, TaskModel };
