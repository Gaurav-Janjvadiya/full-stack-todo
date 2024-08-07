const mongoose = require("mongoose");

const todoSchema = mongoose.Schema({
  todo: {
    type: String,
    required: true,
  },
  completed: {
    type: Boolean,
    default: false,
  },
  // owner: {
  //   type: mongoose.Schema.ObjectId,
  // },
});

const Todo = new mongoose.model("Todo", todoSchema);

module.exports = Todo;
