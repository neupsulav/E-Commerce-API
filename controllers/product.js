const Product = require("../models/product");
const catchAsync = require("../middlewares/catchAsync");
const ErrorHandler = require("../middlewares/errorHandler");
const Category = require("../models/category");
const mongoose = require("mongoose");

//create a product
const createProduct = catchAsync(async (req, res, next) => {
  const { name, description, category, countInStock } = req.body;

  if (!name || !description || !category || !countInStock) {
    return next(new ErrorHandler("Please fill all the fields properly", 400));
  }

  const findCategory = await Category.findOne({ _id: req.body.category });
  if (!findCategory) {
    return next(new ErrorHandler("Invalid category", 400));
  }

  const newProduct = await Product.create(req.body);
  newProduct.save();

  if (!newProduct) {
    return next(new ErrorHandler("Product cannot be created", 400));
  }

  res.status(201).json({ msg: "New product created", newProduct });
});

//delete a product
const deleteProduct = catchAsync(async (req, res, next) => {
  if (!mongoose.isValidObjectId(req.params.id)) {
    return next(new ErrorHandler("Invalid product ID", 400));
  }

  const id = req.params.id;

  const product = await Product.findByIdAndRemove({ _id: id });

  if (!product) {
    return next(new ErrorHandler("Product not found", 404));
  }

  res.status(200).json({ success: true, msg: "Successfully deleted" });
});

//get all products
const getProducts = catchAsync(async (req, res, next) => {
  const products = await Product.find({}).populate("category");

  res.status(200).send(products);
});

//get a product
const getProduct = catchAsync(async (req, res, next) => {
  if (!mongoose.isValidObjectId(req.params.id)) {
    return next(new ErrorHandler("Invalid product ID", 400));
  }

  const id = req.params.id;

  const product = await Product.findOne({ _id: id }).populate("category");
  if (!product) {
    return next(new ErrorHandler(`No product found with id ${id}`, 404));
  }

  res.status(200).send(product);
});

//update a product
const updateProduct = catchAsync(async (req, res, next) => {
  if (!mongoose.isValidObjectId(req.params.id)) {
    return next(new ErrorHandler("Invalid product ID", 400));
  }

  const { name, description, category, countInStock } = req.body;

  if (!name || !description || !category || !countInStock) {
    return next(new ErrorHandler("Please fill all the fields properly", 400));
  }

  const findCategory = await Category.findOne({ _id: req.body.category });
  if (!findCategory) {
    return next(new ErrorHandler("Invalid category", 400));
  }

  const id = req.params.id;

  const product = await Product.findByIdAndUpdate({ _id: id }, req.body, {
    new: true,
  }).populate("category");

  if (!product) {
    return next(new ErrorHandler(`No category with id ${id} found`, 404));
  }

  res.status(200).send(product);
});

module.exports = {
  createProduct,
  deleteProduct,
  getProducts,
  getProduct,
  updateProduct,
};
