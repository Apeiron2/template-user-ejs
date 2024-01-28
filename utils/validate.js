const { string } = require("yup");
module.exports = {
  login: {
    email: string().required("Tên không được để trống!"),
    password: string().min(6, "Mật khẩu phải có ít 6 kí tự!"),
  },
  register: {
    name: string().required("Tên không được để trống!"),
    email: string()
      .email("Email không hợp lệ!")
      .required("Email không được để trống!"),
    password: string().min(6, "Mật khẩu phải có ít 6 kí tự!"),
  },
};
