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
var crypto = require("crypto");

// Connect to MongoDB
const con = async () => {
  mongoose.connect("mongodb://127.0.0.1:27017/mytodo");
};

con()
  .then(() => console.log("DB connected"))
  .catch((e) => console.log(e));

// Set view engine and views directory
app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "views"));

const sessionOptions = {
  secret: "secretString",
  resave: false,
  saveUninitialized: true,
  cookie: {
    expires: Date.now() + 7 * 24 * 60 * 60 * 1000,
    maxAge: 7 * 24 * 60 * 60 * 1000,
    httpOnly: true,
  },
};

// Middleware setup
app.use(session(sessionOptions));
app.use(express.urlencoded({ extended: true }));
app.use(methodOverride("_method"));
app.use(express.static(path.join(__dirname, "public")));
app.use(flash());

// Passport.js configuration
app.use(passport.initialize());
app.use(passport.session());
passport.use(new LocalStrategy(User.authenticate()));

passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());

app.use((req, res, next) => {
  res.locals.error = req.flash("error");
  res.locals.success = req.flash("success");
  next();
});

// Routes

//todo routes
app.get("/", async (req, res) => {
  const todos = await Todo.find({});
  res.render("index", { todos });
});

app.get("/todo/new", (req, res) => {
  res.render("todo/new");
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
  res.render("todo/edit", { todo });
});

app.put("/todo/:id/update", async (req, res) => {
  const { id } = req.params;
  const todo = req.body;
  await Todo.findByIdAndUpdate(id, { todo: todo.todo });
  res.redirect("/");
});

//user routes
app.get("/signup", (req, res) => {
  res.render("./user/signup");
});

app.post("/signup", async (req, res) => {
  let user = new User({ username: req.body.username, email: req.body.email });
  await User.register(user, req.body.password);
  res.redirect("/");
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
    // req.flash("success", "You are logged in!");
    res.redirect("/");
  }
);

// Start the server
app.listen(8000, () => {
  console.log("Server is running on http://localhost:8000");
});
