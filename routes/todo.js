const express = require("express");
const router = express.Router();
const Todo = require("../models/todo");
const wrapAsync = require("../utils/wrapAsync");
const todoController = require("../controllers/todos");

// Todo routes
router.get("/", wrapAsync(todoController.renderTodos));

router.get("/new", todoController.renderNewForm);

router.post("/", wrapAsync(todoController.createTodo));

router.patch("/:id/completed", wrapAsync(todoController.completeTodo));

router.delete("/:id/delete", wrapAsync(todoController.destroyTodo));

router.get("/:id/edit", wrapAsync(todoController.renderEditForm));

router.put("/:id/update", wrapAsync(todoController.updateTodo));

module.exports = router;
