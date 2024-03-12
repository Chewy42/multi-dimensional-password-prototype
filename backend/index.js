const express = require("express");
const cors = require("cors");
const app = express();
const sqlite3 = require("sqlite3").verbose();
const passport = require('passport');
const session = require('express-session');

app.use(session({
  secret: 'fowler',
  resave: false,
  saveUninitialized: true,
}));

app.use(passport.initialize());
app.use(passport.session());

let db = new sqlite3.Database("./database/demo.db", (err) => {
  if (err) {
    return console.error(err.message);
  }
  console.log("Connected to the SQlite database.");
});

db.run(`
  CREATE TABLE users(
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  name VARCHAR(255),
  email VARCHAR(255),
  password VARCHAR(255));`,
  (err) => {
    if (err) {
      return console.log("Users table identified.");
    }
    console.log("Users table created.");
  }
);
db.close((err) => {
  if (err) return console.error(err.message);
  console.log("Close the database connection.");
});

app.use(
  cors({
    origin: "http://localhost:3000",
  })
);
app.use(express.json());

require("dotenv").config();

app.get("/", (req, res) => res.send("Hello World!"));

// API routes
const authRoutes = require("./routes/authRoutes");
app.use("/api/auth", authRoutes);

//DO NOT TOUCH unless you know what you're doing
//Allows front end to communicate with backend
app.use(function (req, res, next) {
  res.header("Access-Control-Allow-Origin", "http://localhost:3000");
  res.header("Access-Control-Allow-Credentials", true);
  res.header(
    "Access-Control-Allow-Headers",
    "Origin, X-Requested-With, Content-Type, Accept"
  );
  next();
});

const PORT = process.env.PORT || 3001;

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
