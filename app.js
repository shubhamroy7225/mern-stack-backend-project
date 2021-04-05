const express = require("express");
require("dotenv").config();
const fs = require("fs");
const path = require('path')
const mongoose = require("mongoose");
const bodyParser = require("body-parser");
const placesRouter = require("./routes/places.route");
const usersRouter = require("./routes/users.routes");
const HttpError = require("./models/http-error");
const app = express();

app.use((req, res, next) => {
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader(
    "Access-Control-Allow-Headers",
    "Origin, X-Requested-With,Content-Type,Accept,Authorization"
  );
  res.setHeader("Access-Control-Allow-Methods", "GET,POST,PATCH,DELETE");
  next();
});
app.use(bodyParser.json());
app.use("/api/places", placesRouter);
app.use("/api/users", usersRouter); 
app.use('/uploads/images',express.static(path.join('uploads','images')))
app.use((req, res, next) => {
  const error = new HttpError("could not find the this routes", 404);
  throw error;
});
app.use((error, req, res, next) => {
  if (req.file) {
    fs.unlink(req.file.path, err => {
      console.log(err);
    });
  }
  if (res.headerSent) {
    return next(error);
  }
  res.status(error.code || 500);
  res.json({ message: error.message || "An unknown error occurred" });
});
mongoose
  .connect(
    `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASSWORD}@cluster0.0wmkg.mongodb.net/mernDatabase?retryWrites=true&w=majority`
  )
  .then(() => {
    app.listen(process.env.PORT || 5001);
    console.log("Connected to database...");
  })
  .catch(() => {
    console.log("Connection failed");
  });
