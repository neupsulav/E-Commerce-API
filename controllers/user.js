const User = require("../models/user");
const catchAsync = require("../middlewares/catchAsync");
const ErrorHandler = require("../middlewares/errorHandler");
const { default: mongoose } = require("mongoose");

//register a user
const register = catchAsync(async (req, res, next) => {
  const { name, email, passwordHash, phone } = req.body;

  if (!name || !email || !passwordHash || !phone) {
    return next(new ErrorHandler("Please fill all the fields properly", 400));
  }

  const newUser = await User.create(req.body);
  newUser.save();

  if (!newUser) {
    return next(new ErrorHandler("User cannot be created", 400));
  }

  res.status(201).json({ msg: "User registered successfully", newUser });
});

//get all the users
const getUsers = catchAsync(async (req, res, next) => {
  const users = await User.find({}).select("-passwordHash");
  res.status(200).send(users);
});

// get a single user
const getUser = catchAsync(async (req, res, next) => {
  const id = req.params.id;

  if (!mongoose.isValidObjectId(id)) {
    return next(new ErrorHandler("Invalid user ID", 400));
  }

  const user = await User.findOne({ _id: id }).select("-passwordHash");

  if (!user) {
    return next(new ErrorHandler(`No user found with id ${id}`, 404));
  }

  res.status(200).send(user);
});

//login user
const login = catchAsync(async (req, res, next) => {
  const { email, passwordHash } = req.body;

  if (!email || !passwordHash) {
    return next(new ErrorHandler("Please fill all the fields properly", 400));
  }

  const user = await User.findOne({ email: email });

  if (!user) {
    return next(new ErrorHandler("Invalid user credentials", 400));
  }

  //compare password
  const isPasswordMatch = await user.comparePassword(passwordHash);

  if (!isPasswordMatch) {
    return next(new ErrorHandler("Invalid user credentials", 400));
  }

  const token = await user.getJWT();

  res.status(200).json({ msg: "user logged in successfully", token: token });
});

//get user count
const userCount = catchAsync(async (req, res, next) => {
  if (!req.user.isAdmin) {
    return next(new ErrorHandler("User is not authorized", 400));
  }

  const count = (await User.find({})).length;

  res.status(200).json({ count: count });
});

//delete a user
const deleteUser = catchAsync(async (req, res, next) => {
  if (!mongoose.isValidObjectId(req.params.id)) {
    return next(new ErrorHandler("Invalid user ID", 400));
  }

  if (!req.user.isAdmin) {
    return next(new ErrorHandler("User is not authorized", 400));
  }

  const id = req.params.id;

  const user = await User.findByIdAndRemove({ _id: id });

  if (!user) {
    return next(new ErrorHandler("UserS not found", 404));
  }

  res.status(200).json({ success: true, msg: "Successfully deleted" });
});

module.exports = {
  register,
  getUsers,
  getUser,
  login,
  userCount,
  deleteUser,
};
