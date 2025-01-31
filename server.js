const express = require("express");
const mysql = require("mysql2");
const bodyParser = require("body-parser");
const app = express();
const port = 3000;


app.use(bodyParser.json());

// Database connection
const db = mysql.createConnection({
  host: "localhost",
  user: "root",
  password: "1234",
  database: "company"
});

db.connect(err => {
  if (err) {
    console.error("Database connection failed: ", err);
  } else {
    console.log("Connected to MySQL database");
  }
});

// Create Employee
app.post("/employees", (req, res) => {
  const { name, age, department } = req.body;
  const sql = "INSERT INTO employee (name, age, department) VALUES (?, ?, ?)";
  db.query(sql, [name, age, department], (err, result) => {
    if (err) {
      res.status(500).json({ error: err.message });
    } else {
      res.status(201).json({ message: "Employee added successfully", id: result.insertId });
    }
  });
});

// Read Employees
app.get("/employees", (req, res) => {
  db.query("SELECT * FROM employee", (err, results) => {
    if (err) {
      res.status(500).json({ error: err.message });
    } else {
      res.json(results);
    }
  });
});

// Read Single Employee
app.get("/employees/:id", (req, res) => {
  const { id } = req.params;
  db.query("SELECT * FROM employee WHERE eId = ?", [id], (err, result) => {
    if (err) {
      res.status(500).json({ error: err.message });
    } else if (result.length === 0) {
      res.status(404).json({ message: "Employee not found" });
    } else {
      res.json(result[0]);
    }
  });
});

// Update Employee
app.put("/employees/:id", (req, res) => {
  const { id } = req.params;
  const { name, age, department } = req.body;
  const sql = "UPDATE employee SET name = ?, age = ?, department = ? WHERE eId = ?";
  db.query(sql, [name, age, department, id], (err, result) => {
    if (err) {
      res.status(500).json({ error: err.message });
    } else {
      res.json({ message: "Employee updated successfully" });
    }
  });
});

// Delete Employee
app.delete("/employees/:id", (req, res) => {
  const { id } = req.params;
  db.query("DELETE FROM employee WHERE eId = ?", [id], (err, result) => {
    if (err) {
      res.status(500).json({ error: err.message });
    } else {
      res.json({ message: "Employee deleted successfully" });
    }
  });
});

// Start server
app.listen(port, () => {
  console.log(`Server running on http://localhost:${port}`);
});
