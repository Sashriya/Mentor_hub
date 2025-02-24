require("dotenv").config();
const express = require("express");
const mysql = require("mysql");
const cors = require("cors");
const bodyParser = require("body-parser");

const app = express();
app.use(cors());
app.use(bodyParser.json());

// Database Connection
const db = mysql.createConnection({
    host: "localhost",
    user: "root",
    password: "Mentor_hub2025", 
    database: "mentor_hub"
});

db.connect(err => {
    if (err) {
        console.error("Database connection failed: " + err.stack);
        return;
    }
    console.log("Connected to MySQL database");
});

// Register Route
app.post("/register", (req, res) => {
    const { name, email, password, role, dob, gender, address, qualification, subject, teaching, willing } = req.body;
    
    const query = "INSERT INTO users (name, email, password, role, dob, gender, address, qualification, subject, teaching, willing) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)";
    
    db.query(query, [name, email, password, role, dob, gender, address, qualification, subject, teaching, willing], (err, result) => {
        if (err) {
            console.error(err);
            return res.status(500).json({ message: "Error registering user" });
        }
        res.status(201).json({ message: "User registered successfully" });
    });
});

// Fetch All Users (Admin only)
app.get("/users", (req, res) => {
    db.query("SELECT * FROM users", (err, results) => {
        if (err) {
            console.error(err);
            return res.status(500).json({ message: "Error fetching users" });
        }
        res.json(results);
    });
});

// Assign Task to Tutor (Admin)
app.post("/assign-task", (req, res) => {
    const { tutor_id, task, lesson } = req.body;
    
    const query = "INSERT INTO tasks (tutor_id, task, lesson) VALUES (?, ?, ?)";
    
    db.query(query, [tutor_id, task, lesson], (err, result) => {
        if (err) {
            console.error(err);
            return res.status(500).json({ message: "Error assigning task" });
        }
        res.status(201).json({ message: "Task assigned successfully" });
    });
});

// Start Server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});
