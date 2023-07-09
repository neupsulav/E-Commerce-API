const User = require("../models/user");
const jwt = require("jsonwebtoken");
const ErrorHandler = require("./errorHandler");
const catchAsync = require("./catchAsync");

const authentication = catchAsync(async (req, res, next) => {
  const authorization = req.headers.authorization;

  if (!authorization || !authorization.startsWith("Bearer ")) {
    return next(new ErrorHandler("Aunthentication failed"), 400);
  }

  const token = authorization.split(" ")[1];

  const payload = jwt.verify(token, process.env.SECRET_KEY);

  req.user = {
    userId: payload.userId,
    userName: payload.userName,
    userEmail: payload.userEmail,
    isAdmin: payload.isAdmin,
  };

  next();
});

module.exports = authentication;
