const { User, Role, Permission } = require("../models/index");
module.exports = (permission) => {
  return async (req, res, next) => {
    const { id } = req.user;
    const user = await User.findByPk(id, {
      include: {
        module: Role,
        as: "roles",
        include: {
          module: Permission,
          as: "permissions",
        },
      },
    });
    console.log(user);
    const permissions = [];
    if (user.roles.length) {
      user.roles.forEach((role) => {
        role.permissions.forEach((permission) => {
          !permissions.include(permission) &&
            permissions.push(permission.value);
        });
      });
    }
    req.can = (value) => {
      return permissions.includes(value);
    };
    if (permissions.includes(permission)) {
      return next();
    }
    return next(new Error("Bạn không có quyền truy cập vào trang này"));
  };
};
