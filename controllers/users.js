const User = require("../models/user");

module.exports.renderSignUpForm = (req, res) => {
  res.render("./user/signup");
};

module.exports.signUp = async (req, res, next) => {
  let user = new User({ username: req.body.username, email: req.body.email });
  await User.register(user, req.body.password);
  res.redirect("/todos");
};

module.exports.renderLoginForm = (req, res) => {
  res.render("./user/login");
};

module.exports.login = (req, res) => {
  req.flash("success", "You are logged in!");
  res.redirect("/todos");
};

module.exports.logout = (req, res, next) => {
  req.logout(function (err) {
    if (err) {
      next(err);
    }
    req.flash("error", "You are logged out");
    res.redirect("/todos");
  });
};
