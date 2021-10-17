var createError = require("http-errors");
var cors = require("cors");
var express = require("express");
var path = require("path");
var cookieParser = require("cookie-parser");
var logger = require("morgan");
let mongoose = require("mongoose");
const jwt = require("jsonwebtoken");
var apiRouter = require("./routes/index");
var usersRouter = require("./routes/users");
const dbConfig = require("./config/db.config.js");

var app = express();
app.use(cors());

app.use(logger("dev"));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, "public")));

mongoose.Promise = global.Promise;
// Connecting to the database
mongoose
  .connect(dbConfig.url, {
    useNewUrlParser: true,
  })
  .then(() => {
    console.log("Successfully connected to the database");
  })
  .catch((err) => {
    console.log("Could not connect to the database. Exiting now...", err);
    process.exit();
  });

let verifyToken = (req, res, next) => {
  const bearerHeader = req.headers["authorization"];

  if (typeof bearerHeader !== "undefined") {
    const bearer = bearerHeader.split(" ");
    const bearerToken = bearer[1];
    req.token = bearerToken;
    jwt.verify(
      bearerToken,
      "817f8507643c3252fbe23b1582e699fb3cf3901757b8f1cf954982761963353b7d788282aa9e4af8d3141f5b76770c19a2578da18d2e1453a673bac982e41ea8",
      (err, data) => {
        if (err) {
          return res.sendStatus(403);
        }
        next();
      }
    );
  } else {
    res.sendStatus(403);
  }
};
app.get("/", function (req, res) {
  res.send("Welecome to the api");
});
app.use("/api", verifyToken, apiRouter);
app.use("/users", usersRouter);

module.exports = app;
