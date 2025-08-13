const express = require("express");
const cors = require("cors");
const taskRoutes = require("./routes/taskRoutes");
const app = express();
const PORT = process.env.PORT || 5000;
app.use(cors());
app.use(express.json());
app.use("/tasks", taskRoutes);
app.get("/", (req, res) => {
  res.send("TaskMaster API is running!");
});
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
