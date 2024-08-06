const express = require("express");
const app = express();
const { v4: uuidv4 } = require("uuid");
// const ejs = require("ejs");
const path = require("path");
const mongoose = require("mongoose");

const con = async () => {
  mongoose.connect("mongodb://127.0.0.1:27017/test");
};

con()
  .then(() => console.log("DB connected"))
  .catch((e) => console.log(e));

app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "views"));

app.get("/", (req, res) => {
  res.render("index.ejs");
});

app.listen(8000, () => {
  console.log("server is started on http://localhost:8000");
});
