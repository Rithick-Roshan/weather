import express from "express";
import cors from 'cors';
import jwt from "jsonwebtoken";
import cookieParser from "cookie-parser";
import mysql from 'mysql';

const app = express();
const PORT = 5000;

// MySQL Connection
const con = mysql.createConnection({
    host: "localhost",
    user: "root",
    password: "msipc2004",
    database: "Logger"
});

con.connect(err => {
    if (err) {
        console.error("Connection error:", err);
    } else {
        console.log("Connected to MySQL");
    }
});

// Middleware
app.use(cors({
    origin: ["http://localhost:3000"],
    methods: ['GET', 'POST', 'PUT', "DELETE"],
    credentials: true
}));
app.use(express.json());
app.use(cookieParser());

// Login Route
app.post('/login', (req, res) => {
    console.log("Login request received with body:", req.body); // Ensure this is within the route
    const sql = "SELECT * FROM admin WHERE email = ? AND password = ?";
    con.query(sql, [req.body.email, req.body.password], (err, result) => {
        if (err) {
            console.error("Database query error:", err);
            return res.json({ loginStatus: false, Error: "Query error" });
        }
        if (result.length > 0) {
            const token = jwt.sign({ role: "admin", email: result[0].email, id: result[0].id }, "jwt_secret_key", { expiresIn: "1d" });
            res.cookie('token', token);
            return res.json({ loginStatus: true });
        } else {
            console.log("Wrong email or password for email:", req.body.email);
            return res.json({ loginStatus: false, Error: "Wrong email or password" });
        }
    });
});1234
// Add this to your Express server code

app.post('/signin', (req, res) => {
    const { email, password } = req.body;

    // Check if all fields are provided
    if (!email || !password) {
        return res.json({ signupStatus: false, Error: "All fields are required." });
    }

    // Here you should hash the password before saving it to the database.
    const sqlCheck = "SELECT * FROM admin WHERE email = ?";
    con.query(sqlCheck, [email], (err, result) => {
        if (err) {
            console.error("Database query error:", err);
            return res.json({ signupStatus: false, Error: "Query error" });
        }
        if (result.length > 0) {
            return res.json({ signupStatus: false, Error: "Email already exists." });
        }

        // Insert new user
        const sqlInsert = "INSERT INTO admin (email, password) VALUES (?, ?)";
        con.query(sqlInsert, [email, password], (err) => {
            if (err) {
                console.error("Database insert error:", err);
                return res.json({ signupStatus: false, Error: "Error creating user." });
            }
            return res.json({ signupStatus: true });
        });
    });
});

// Other routes...

// Start the Express Server
app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});
