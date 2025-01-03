const express = require("express");
const mysql = require("mysql2");
const bodyParser = require("body-parser");

const app = express();
const port = 3006;

app.use(bodyParser.json());

const db = mysql.createConnection({
  host: "localhost",
  user: "root",
  password: "dufedanceq",
  database: "db",
});

db.connect((err) => {
  if (err) {
    console.error("Error connecting to database:", err);
    return;
  }
  console.log("Connection to database successful!");
});

app.get("/analysis_tasks", (req, res) => {
  const query = "SELECT * FROM analysis_task";
  db.query(query, (err, results) => {
    if (err) {
      console.error("Error executing query:", err);
      res.status(500).json({ error: "Server error" });
    } else {
      res.json(results);
    }
  });
});

app.get("/analysis_tasks/:id", (req, res) => {
  const taskId = req.params.id;
  const query = "SELECT * FROM analysis_task WHERE id = ?";
  db.query(query, [taskId], (err, results) => {
    if (err) {
      console.error("Error executing query:", err);
      res.status(500).json({ error: "Server error" });
    } else if (results.length === 0) {
      res.status(404).json({ error: "Task not found" });
    } else {
      res.json(results[0]);
    }
  });
});

app.post("/analysis_tasks", (req, res) => {
  const { created_at, user_id, project_id, name, status } = req.body;
  const query =
    "INSERT INTO analysis_task (created_at, user_id, project_id, name, status) VALUES (?, ?, ?, ?, ?)";
  db.query(
    query,
    [created_at, user_id, project_id, name, status],
    (err, result) => {
      if (err) {
        console.error("Error executing query:", err);
        res.status(500).json({ error: "Server error" });
      } else {
        res
          .status(201)
          .json({ message: "Task created", taskId: result.insertId });
      }
    }
  );
});

app.put("/analysis_tasks/:id", (req, res) => {
  const { id } = req.params;
  const { created_at, user_id, project_id, name, status } = req.body;
  const query =
    "UPDATE analysis_task SET created_at = ?, user_id = ?, project_id = ?, name = ?, status = ? WHERE id = ?";
  db.query(
    query,
    [created_at, user_id, project_id, name, status, id],
    (err, result) => {
      if (err) {
        console.error("Error executing query:", err);
        res.status(500).json({ error: "Server error" });
      } else if (result.affectedRows === 0) {
        res.status(404).json({ error: "Task not found" });
      } else {
        res.json({ message: "Task updated" });
      }
    }
  );
});

app.delete("/analysis_tasks/:id", (req, res) => {
  const { id } = req.params;
  const query = "DELETE FROM analysis_task WHERE id = ?";
  db.query(query, [id], (err, result) => {
    if (err) {
      console.error("Error executing query:", err);
      res.status(500).json({ error: "Server error" });
    } else if (result.affectedRows === 0) {
      res.status(404).json({ error: "Task not found" });
    } else {
      res.json({ message: "Task deleted" });
    }
  });
});

app.listen(port, () => {
  console.log(`The server is running on http://localhost:${port}`);
});
