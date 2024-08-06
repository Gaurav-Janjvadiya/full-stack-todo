const express = require("express");
const app = express();
const path = require("path");
const mongoose = require("mongoose");
const Todo = require("./models/todo");

const con = async () => {
  mongoose.connect("mongodb://127.0.0.1:27017/mytodo");
};

con()
  .then(() => console.log("DB connected"))
  .catch((e) => console.log(e));

app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "views"));

app.use(express.urlencoded({ extended: true }));

app.get("/", async (req, res) => {
  const todos = await Todo.find({});
  res.render("./index.ejs", { todos });
});

app.get("/todo/new", (req, res) => {
  res.render("new.ejs");
});

app.post("/todo", async (req, res) => {
  const todo = new Todo(req.body);
  await todo.save();
  res.redirect("/");
});

app.listen(8000, () => {
  console.log("server is started on http://localhost:8000");
});
