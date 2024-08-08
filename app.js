const express = require("express");
const app = express();
const path = require("path");
const mongoose = require("mongoose");
const Todo = require("./models/todo");
const methodOverride = require("method-override");
const passport = require("passport");
const LocalStrategy = require("passport-local").Strategy;
const User = require("./models/user");
const session = require("express-session");
const flash = require("connect-flash");
const engine = require("ejs-mate");

// Connect to MongoDB
mongoose
  .connect("mongodb://127.0.0.1:27017/mytodo")
  .then(() => console.log("DB connected"))
  .catch((e) => console.log(e));

// Set view engine and views directory
app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "views"));

// Middleware setup
app.use(
  session({
    secret: "secretString",
    resave: false,
    saveUninitialized: true,
    cookie: {
      expires: Date.now() + 7 * 24 * 60 * 60 * 1000,
      maxAge: 7 * 24 * 60 * 60 * 1000,
      httpOnly: true,
    },
  })
);
app.use(express.urlencoded({ extended: true }));
app.use(methodOverride("_method"));
app.use(express.static(path.join(__dirname, "public")));
app.use(flash());
app.engine("ejs", engine);

// Passport.js configuration
app.use(passport.initialize());
app.use(passport.session());
passport.use(new LocalStrategy(User.authenticate()));

passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());

app.use((req, res, next) => {
  res.locals.error = req.flash("error");
  res.locals.success = req.flash("success");
  res.locals.user = req.user;
  next();
});

// Routes

// Todo routes
app.get("/", async (req, res, next) => {
  try {
    const todos = await Todo.find({});
    res.render("./todo/index", { todos });
  } catch (error) {
    next(error);
  }
});

app.get("/todo/new", (req, res) => {
  res.render("./todo/new");
});

app.post("/todo", async (req, res, next) => {
  try {
    const todo = new Todo(req.body);
    await todo.save();
    req.flash("success", "Todo created!");
    res.redirect("/");
  } catch (error) {
    next(error);
  }
});

app.patch("/todo/:id/completed", async (req, res, next) => {
  try {
    const { id } = req.params;
    await Todo.findByIdAndUpdate(id, { completed: true });
    res.redirect("/");
  } catch (error) {
    next(error);
  }
});

app.delete("/todo/:id/delete", async (req, res, next) => {
  try {
    const { id } = req.params;
    await Todo.findByIdAndDelete(id);
    req.flash("error", "Todo deleted!");
    res.redirect("/");
  } catch (error) {
    next(error);
  }
});

app.get("/todo/:id/edit", async (req, res, next) => {
  try {
    const todo = await Todo.findById(req.params.id);
    res.render("./todo/edit", { todo });
  } catch (error) {
    next(error);
  }
});

app.put("/todo/:id/update", async (req, res, next) => {
  try {
    const { id } = req.params;
    const todo = req.body;
    await Todo.findByIdAndUpdate(id, { todo: todo.todo });
    req.flash("success", "Todo updated!");
    res.redirect("/");
  } catch (error) {
    next(error);
  }
});

// User routes
app.get("/signup", (req, res) => {
  res.render("./user/signup");
});

app.post("/signup", async (req, res, next) => {
  try {
    let user = new User({ username: req.body.username, email: req.body.email });
    await User.register(user, req.body.password);
    res.redirect("/");
  } catch (error) {
    next(error);
  }
});

app.get("/login", (req, res) => {
  res.render("./user/login");
});

app.post(
  "/login",
  passport.authenticate("local", {
    failureRedirect: "/login",
    failureFlash: true,
  }),
  (req, res) => {
    req.flash("success", "You are logged in!");
    res.redirect("/");
  }
);

app.post("/logout", function (req, res, next) {
  req.logout(function (err) {
    if (err) {
      next(err);
    }
    req.flash("error", "You are logged out");
    res.redirect("/");
  });
});

// Error handler
// app.use((err, req, res, next) => {
//   console.log(err.name);
//   req.flash("error", "Something went wrong!");
//   res.redirect("/");
// });

// Start the server
app.listen(8000, () => {
  console.log("Server is running on http://localhost:8000");
});
