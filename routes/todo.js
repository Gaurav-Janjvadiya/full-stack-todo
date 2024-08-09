const express = require("express");
const router = express.Router();
const wrapAsync = require("../utils/wrapAsync");
const todoController = require("../controllers/todos");
const { isOwner, isLoggedIn, validateTodo } = require("../middleware");

// Todo routes
router.get("/", isLoggedIn, wrapAsync(todoController.renderTodos));

router.get("/new", isLoggedIn, todoController.renderNewForm);

router.post("/", validateTodo, wrapAsync(todoController.createTodo));

router.patch(
  "/:id/completed",
  isLoggedIn,
  isOwner,
  wrapAsync(todoController.completeTodo)
);

router.delete(
  "/:id/delete",
  isLoggedIn,
  isOwner,
  wrapAsync(todoController.destroyTodo)
);

router.get(
  "/:id/edit",
  isLoggedIn,
  isOwner,
  wrapAsync(todoController.renderEditForm)
);

router.put(
  "/:id/update",
  isLoggedIn,
  isOwner,
  validateTodo,
  wrapAsync(todoController.updateTodo)
);

module.exports = router;
