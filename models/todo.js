const mongoose = require("mongoose");

const todoSchema = mongoose.Schema({
  todo: String,
});

const Todo = new mongoose.model("Todo", todoSchema);

module.exports = Todo;