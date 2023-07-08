const Category = require("../models/category");
const catchAsync = require("../middlewares/catchAsync");
const ErrorHandler = require("../middlewares/errorHandler");

// creating new category
const createCategory = catchAsync(async (req, res, next) => {
  const { name, color, icon } = req.body;

  if (!name || !color || !icon) {
    return next(new ErrorHandler("Please enter all the values properly", 400));
  }

  const newCategory = await Category.create({ name, color, icon });
  newCategory.save();

  if (!newCategory) {
    return next(new ErrorHandler("Category cannot be created", 400));
  }

  res.status(201).json({ msg: "New Category created", newCategory });
});

//deleting a category
const deleteCategory = catchAsync(async (req, res, next) => {
  const id = req.params.id;

  const deleteCategory = await Category.findByIdAndRemove({ _id: id });

  if (!deleteCategory) {
    return next(new ErrorHandler(`No category with id ${id} found`, 404));
  }

  res
    .status(200)
    .json({ success: true, msg: `Deleted category with id ${id}` });
});

//get all categories
const getAllCategories = catchAsync(async (req, res, next) => {
  const categories = await Category.find({});

  res.status(200).send(categories);
});

//get a category
const getCategory = catchAsync(async (req, res, next) => {
  const id = req.params.id;
  const singleCategory = await Category.find({ _id: id });

  if (!singleCategory) {
    return next(new ErrorHandler(`No category with id ${id} found`, 404));
  }
  res.status(200).json(singleCategory);
});

//update a category
const updateCategory = catchAsync(async (req, res, next) => {
  const id = req.params.id;
  const updateCategory = await Category.findByIdAndUpdate(
    { _id: id },
    req.body,
    { new: true }
  );

  if (!updateCategory) {
    return next(new ErrorHandler(`No category with id ${id} found`, 404));
  }

  res.status(200).send(updateCategory);
});

module.exports = {
  createCategory,
  deleteCategory,
  getAllCategories,
  getCategory,
  updateCategory,
};
