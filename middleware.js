const Todo = require("./models/todo");
const { todoSchema,userSchema } = require("./schema");

module.exports.isOwner = async (req, res, next) => {
  const { id } = req.params;
  const todo = Todo.findById(id);
  if (!todo.user.equals(res.locals.user._id)) {
    req.flash("error", "You don't have permission");
    return res.redirect("/todos");
  }
};

module.exports.isLoggedIn = (req, res, next) => {
  if (!req.isAuthenticated()) {
    req.session.redirectUrl = req.originalUrl;
    req.flash("error", "You must be logged in!");
    return res.redirect("/login");
  }
  next();
};

module.exports.validateTodo = (req, res, next) => {
  let { error } = todoSchema.validate(req.body);
  if (error) {
    let errorMessage = error.details.map((el) => el.message).join(",");
    throw new ExpressError(400, errorMessage);
  } else {
    next();
  }
};
module.exports.validateUser = (req, res, next) => {
  let { error } = userSchema.validate(req.body);
  if (error) {
    let errorMessage = error.details.map((el) => el.message).join(",");
    throw new ExpressError(400, errorMessage);
  } else {
    next();
  }
};
