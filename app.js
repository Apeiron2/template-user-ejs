var createError = require("http-errors");
var express = require("express");
var path = require("path");
var cookieParser = require("cookie-parser");
var logger = require("morgan");
var session = require("express-session");
var flash = require("express-flash");
var expressLayouts = require("express-ejs-layouts");
const passport = require("passport");
var indexRouter = require("./routes/index");
var usersRouter = require("./routes/users");
var authRouter = require("./routes/auth");

// Middlewares
const authMiddleware = require("./middlewares/auth.middleware");
const guestMiddleware = require("./middlewares/guest.middleware");
const validateMiddleware = require("./middlewares/validate.middlware");
const { User } = require("./models/index");
const passportLocal = require("./passports/passport.local");

var app = express();
app.use(
  session({
    secret: "apeiron",
    resave: false,
    saveUninitialized: true,
  })
);
app.use(flash());

app.use(passport.initialize());
app.use(passport.session());
passport.use("local", passportLocal);

passport.serializeUser(function (user, done) {
  done(null, user.id);
});
passport.deserializeUser(async function (id, done) {
  const user = await User.findByPk(id);
  done(null, user);
});
// view engine setup
app.set("views", path.join(__dirname, "views"));
app.set("view engine", "ejs");
app.use(expressLayouts);
app.use(logger("dev"));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, "public")));

app.use("/auth", guestMiddleware, authRouter);
app.use(authMiddleware);
app.use("/", indexRouter);
app.use("/users", usersRouter);

// catch 404 and forward to error handler
app.use(function (req, res, next) {
  next(createError(404));
});

// error handler
app.use(function (err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get("env") === "development" ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render("error");
});

module.exports = app;
