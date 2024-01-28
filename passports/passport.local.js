const { User } = require("../models/index");
const bcrypt = require("bcryptjs");
const LocalStrategy = require("passport-local").Strategy;
module.exports = new LocalStrategy(
  {
    // Sửa lại thông tin request. Mặc định là (username, password)
    usernameField: "email",
    passwordField: "password",
  },
  async (email, password, done) => {
    const user = await User.findOne({ where: { email } });
    if (!user) {
      return done(null, false, {
        message: "Tài khoản không tồn tại!",
      });
    }

    const passwordHash = user.password;
    const result = bcrypt.compareSync(password, passwordHash);
    if (!result) {
      return done(null, false, {
        message: "Mật khẩu không chính xác!",
      });
    }
    done(null, user);
  }
);
