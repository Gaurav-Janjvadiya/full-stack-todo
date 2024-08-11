const express = require("express");
const app = express();
const path = require("path");
const mongoose = require("mongoose");
const methodOverride = require("method-override");
const passport = require("passport");
const LocalStrategy = require("passport-local").Strategy;
const User = require("./models/user");
const session = require("express-session");
const flash = require("connect-flash");
const engine = require("ejs-mate");
const ExpressError = require("./utils/ExpressError");
const todoRouter = require("./routes/todo");
const userRouter = require("./routes/user");
const MongoStore = require("connect-mongo");

if (process.env.NODE_ENV != "production") {
  require("dotenv").config();
}

const dbUrl = process.env.ALTASDB_URL;
// const dbUrl = "mongodb://127.0.0.1:27017/mytodo";
// Connect to MongoDB
main()
  .then(() => console.log("DB Connected"))
  .catch((e) => console.log(e));

async function main() {
  await mongoose.connect(dbUrl);
}
// Set view engine and views directory
app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "views"));

// Middleware setup
const store = MongoStore.create({
  mongoUrl: dbUrl,
  crypto: {
    secret: "secretString",
  },
  touchAfter: 3600 * 24,
});

store.on("error",(err) => {
  console.log("Error in MONGO SESSION STORE",err)
})

const sessionOptions = {
  store,
  secret: "secretString",
  resave: false,
  saveUninitialized: true,
  cookie: {
    expires: Date.now() + 7 * 24 * 60 * 60 * 1000,
    maxAge: 7 * 24 * 60 * 60 * 1000,
    httpOnly: true,
  },
};
app.use(session(sessionOptions));
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
app.get("/", (req, res) => {
  req.flash("error", "please login or signup first");
  res.redirect("/login");
});

app.use("/todos", todoRouter);
app.use("/", userRouter);

app.all("*", (req, res, next) => {
  next(new ExpressError(404, "Page Not Found!"));
});

// Error handler
app.use((err, req, res, next) => {
  console.log(err);
  let { status = 400, message = "something went wrong" } = err;
  res.status(status).render("error.ejs", { message });
});

// Start the server
app.listen(8000, () => {
  console.log("Server is running on http://localhost:8000");
});
