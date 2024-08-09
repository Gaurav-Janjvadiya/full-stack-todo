const User = require("../models/user");

module.exports.renderSignUpForm = (req, res) => {
  res.render("./user/signup");
};

module.exports.signUp = async (req, res, next) => {
  const { username, email, password } = req.body;
  console.log(req.body);
  let user = new User({ username, email });
  await User.register(user, password);
  req.flash("success", "You are logged in!");
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
