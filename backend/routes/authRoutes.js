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

//routes go here
// Signup route
router.post("/signup", async (req, res) => {
  const { name, email, password } = req.body;

  // Hash the password
  const hashedPassword = bcrypt.hashSync(password, 8);

  // Open the database connection
  let db = new sqlite3.Database("./database/demo.db", (err) => {
    if (err) {
      console.error(err.message);
      return res.status(500).send("Error connecting to the database.");
    }
  });

  // Check if the email already exists
  db.get(`SELECT * FROM users WHERE email = ?`, [email], (err, row) => {
    if (err) {
      console.error(err.message);
      return res.status(500).send("Error querying the database.");
    }

    // If the email doesn't exist, send an error response
    if (!row) {
      return res.status(400).send("Email not found.");
    }

    // If the email exists, compare the passwords
    bcrypt.compare(password, row.password, (err, match) => {
      if (err) {
        console.error(err.message);
        return res.status(500).send("Error comparing passwords.");
      }

      if (!match) {
        return res.status(401).send("Authentication failed.");
      }

      // If the passwords match, create JWT
      const token = jwt.sign({ id: row.id }, 'fowler', { expiresIn: '100h' });

      // Send the JWT in the response
      res.json({ token });
    });
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
