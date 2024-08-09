const Todo = require("../models/todo");

module.exports.renderTodos = async (req, res) => {
  let todos = await Todo.find({
    user: res.locals.user && res.locals.user._id,
  });
  res.render("./todo/index.ejs", { todos });
};

module.exports.renderNewForm = (req, res) => {
  res.render("./todo/new");
};

module.exports.createTodo = async (req, res) => {
  console.log(req.body);
  const todo = new Todo({ ...req.body, user: res.locals.user._id });
  await todo.save();
  req.flash("success", "Todo created!");
  res.redirect("/todos");
};

module.exports.completeTodo = async (req, res) => {
  const { id } = req.params;
  await Todo.findByIdAndUpdate(id, { completed: true });
  res.redirect("/todos");
};

module.exports.destroyTodo = async (req, res) => {
  const { id } = req.params;
  await Todo.findByIdAndDelete(id);
  req.flash("error", "Todo deleted!");
  res.redirect("/todos");
};

module.exports.renderEditForm = async (req, res) => {
  const todo = await Todo.findById(req.params.id);
  res.render("./todo/edit", { todo });
};

module.exports.updateTodo = async (req, res) => {
  const { id } = req.params;
  const todo = req.body;
  await Todo.findByIdAndUpdate(id, { todo: todo.todo });
  req.flash("success", "Todo updated!");
  res.redirect("/todos");
};
