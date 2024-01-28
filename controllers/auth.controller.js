const model = require("../models/index");
var bcrypt = require("bcryptjs");
const User = model.User;
const validate = require("../utils/validate");
module.exports = {
  login: (req, res) => {
    const error = req.flash("error");
    return res.render("auth/login", { layout: "auth/layout", error });
  },
  register: (req, res) => {
    const errors = req.errors;
    const oldData = req.flash("oldData")[0];
    const success = req.flash("success")[0];
    const retypeError = req.flash("retypeError")[0];
    return res.render("auth/register", {
      layout: "auth/layout",
      errors,
      oldData,
      success,
      retypeError,
    });
  },
  handleRegister: async (req, res) => {
    const { name, email, password, password2 } = req.body;
    req.flash("oldData", req.body);
    const body = await req.validate(req.body, validate.register);
    if (body) {
      if (password != password2) {
        req.flash("retypeError", "Mật khẩu không trùng khớp");
        return res.redirect("/auth/register");
      }
      const salt = bcrypt.genSaltSync(10, "a");
      const hash = bcrypt.hashSync(password, salt);
      try {
        await User.create({
          name,
          email,
          password: hash,
          status: false,
        });
      } catch (error) {
        console.log(error);
      }
      req.flash("success", "Đăng ký thành công!");
    }
    return res.redirect("/auth/register");
  },
};
