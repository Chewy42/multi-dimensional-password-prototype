const express = require("express");
const bcrypt = require("bcryptjs");
const router = express.Router();
const sqlite3 = require("sqlite3").verbose();
const jwt = require("jsonwebtoken");
const JWT_SECRET = "fowler";

const db = new sqlite3.Database("./database/demo.db");

function getUserByUsername(username, callback) {
  db.get(
    "SELECT * FROM users WHERE username = ?",
    [username],
    function (err, row) {
      callback(err, row);
    }
  );
}

// example -> curl -X POST -H "Content-Type: application/json" -d '{"name":"Matthew","email":"mfavela@favela.com","password":"password"}' http://localhost:3001/api/auth/signup
//routes go here
// Signup route
router.post("/signup", async (req, res) => {
  const { name, email, password } = req.body;

  // Check if all required fields are provided
  if (!name || !email || !password) {
    return res.status(400).send("Name, email, and password are required.");
  }

  try {
    // Open the database connection
    const db = new sqlite3.Database("./database/demo.db");

    // Check if the email already exists
    const existingUser = await new Promise((resolve, reject) => {
      db.get(`SELECT * FROM users WHERE email = ?`, [email], (err, row) => {
        if (err) {
          reject(err);
        } else {
          resolve(row);
        }
      });
    });

    if (existingUser) {
      return res.status(400).send("Email already exists.");
    }

    // Hash the password
    const hashedPassword = await bcrypt.hash(password, 8);

    // Insert the user into the database
    await new Promise((resolve, reject) => {
      db.run(
        `INSERT INTO users (name, email, password) VALUES (?, ?, ?)`,
        [name, email, hashedPassword],
        (err) => {
          if (err) {
            reject(err);
          } else {
            resolve();
          }
        }
      );
    });

    // Close the database connection
    db.close((err) => {
      if (err) {
        console.error(err.message);
        return res.status(500).send("Error closing the database connection.");
      }
      console.log("Closed the database connection.");
    });

    res.status(200).send("User registered successfully.");
  } catch (err) {
    console.error(err.message);
    res.status(500).send("Error during signup.");
  }
});

// Signin route

router.post("/signin", async (req, res) => {
  const { email, password } = req.body;

  if (!email || !password) {
    return res.status(400).send("Email and password are required.");
  }

  // Open the database connection
  let db = new sqlite3.Database("./database/demo.db", (err) => {
    if (err) {
      console.error(err.message);
      return res.status(500).send("Error connecting to the database.");
    }
  });

  // Check if the email exists
  db.get(`SELECT * FROM users WHERE email = ?`, [email], async (err, row) => {
    if (err) {
      console.error(err.message);
      return res.status(500).send("Error querying the database.");
    }

    // If the email doesn't exist, send an error response
    if (!row) {
      return res.status(400).send("Email not found.");
    }

    // If the email exists, compare the passwords
    try {
      const match = await bcrypt.compare(password, row.password);

      if (!match) {
        return res.status(401).send("Authentication failed.");
      }

      // If the passwords match, create a JWT
      const token = jwt.sign({ id: row.id }, JWT_SECRET, { expiresIn: "100h" });

      // Send the JWT in the response
      res.json({ token });
    } catch (err) {
      console.error(err.message);
      return res.status(500).send("Error during authentication.");
    }
  });

  // Close the database connection
  db.close((err) => {
    if (err) {
      console.error(err.message);
      return res.status(500).send("Error closing the database connection.");
    }
    console.log("Closed the database connection.");
  });

});

module.exports = router;
