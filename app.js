const express = require("express");
const app = express();
const path = require("path");
const mongoose = require("mongoose");
const Todo = require("./models/todo");
const methodOverride = require("method-override");

const con = async () => {
  mongoose.connect("mongodb://127.0.0.1:27017/mytodo");
};

con()
  .then(() => console.log("DB connected"))
  .catch((e) => console.log(e));

app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "views"));

app.use(express.urlencoded({ extended: true }));
app.use(methodOverride("_method"));
app.use(express.static(path.join(__dirname, "public")));

app.get("/", async (req, res) => {
  const todos = await Todo.find({});
  res.render("./index.ejs", { todos });
});

app.get("/todo/new", (req, res) => {
  res.render("./todo/new.ejs");
});

app.post("/todo", async (req, res) => {
  const todo = new Todo(req.body);
  await todo.save();
  res.redirect("/");
});

app.patch("/todo/:id/completed", async (req, res) => {
  const { id } = req.params;
  await Todo.findByIdAndUpdate(id, { completed: true });
  res.redirect("/");
});

app.delete("/todo/:id/delete", async (req, res) => {
  const { id } = req.params;
  await Todo.findByIdAndDelete(id);
  res.redirect("/");
});

app.get("/todo/:id/edit", async (req, res) => {
  const todo = await Todo.findById(req.params.id);
  res.render("./todo/edit.ejs", { todo });
});

app.put("/todo/:id/update", async (req, res) => {
  const { id } = req.params;
  const todo = req.body;
  await Todo.findByIdAndUpdate(id, { todo: todo.todo });
  res.redirect("/");
});

app.listen(8000, () => {
  console.log("server is started on http://localhost:8000");
});
