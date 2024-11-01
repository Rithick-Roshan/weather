import express from "express";
import con from "./utils/db.js"; 
import jwt from "jsonwebtoken";

const router = express.Router();

router.post("/login", (req, res) => {
    console.log("Login request received with body:", req.body); // Log the incoming request body
    const sql = "SELECT * FROM admin WHERE email = ? AND password = ?";
    con.query(sql, [req.body.email, req.body.password], (err, result) => {
        if (err) {
            console.error("Database query error:", err); // Log any database query errors
            return res.json({ loginStatus: false, Error: "Query error" });
        }
        if (result.length > 0) {
            const email = result[0].email;
            const token = jwt.sign(
                { role: "admin", email: email, id: result[0].id },
                "jwt_secret_key",
                { expiresIn: "1d" }
            );
            res.cookie('token', token);
            return res.json({ loginStatus: true });
        } else {
            console.log("Wrong email or password for email:", req.body.email); // Log unsuccessful login attempts
            return res.json({ loginStatus: false, Error: "Wrong email or password" });
        }
    });
});


export { router as login };
