const Joi = require("joi");

module.exports.todoSchema = Joi.object({
  todo: Joi.string().required(),
});

module.exports.userSchema = Joi.object({
  username: Joi.string().required(),
  email: Joi.string().required(),
  password: Joi.string().required(),
});
