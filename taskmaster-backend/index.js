import http from "http";
const express = require("express");
const cors = require("cors");
const taskRoutes = require("./routes/taskRoutes");
const app = express();
const PORT = process.env.PORT || 10000;
app.listen(PORT, '0.0.0.0', () => {
  console.log(`Server running on port ${PORT}`);
});
app.get("/health", (req, res) => res.status(200).send("ok"));

const PORT = process.env.PORT || 10000;
const server = http.createServer(app);

// زيد التايم‌آوتات (كما قالت Render)
server.keepAliveTimeout = 120000;   // 120s
server.headersTimeout   = 120000;   // 120s

server.listen(PORT, "0.0.0.0", () => {
  console.log("Server running on", PORT);
});
