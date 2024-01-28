const { object } = require("yup");
module.exports = (req, res, next) => {
  const errors = req.flash("errors");
  req.errors = errors.length ? errors[0] : {};

  req.validate = async (data, rule = {}) => {
    const schema = object(rule);
    try {
      const body = await schema.validate(data, { abortEarly: false });
      return body;
    } catch (error) {
      const errors = Object.fromEntries(
        error.inner.map((item) => [item.path, item.message])
      );
      req.flash("errors", errors);
    }
  };
  next();
};
