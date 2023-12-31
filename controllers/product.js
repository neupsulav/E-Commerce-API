const Product = require("../models/product");
const catchAsync = require("../middlewares/catchAsync");
const ErrorHandler = require("../middlewares/errorHandler");
const Category = require("../models/category");
const mongoose = require("mongoose");

//create a product
const createProduct = catchAsync(async (req, res, next) => {
  if (!req.user.isAdmin) {
    return next(new ErrorHandler("User is not authorized", 400));
  }

  const { name, description, category, countInStock } = req.body;

  if (!name || !description || !category || !countInStock) {
    return next(new ErrorHandler("Please fill all the fields properly", 400));
  }

  const findCategory = await Category.findOne({ _id: req.body.category });
  if (!findCategory) {
    return next(new ErrorHandler("Invalid category", 400));
  }

  //for multer image upload
  const file = req.file;
  if (!file) return next(new ErrorHandler("Image file not received", 400));

  const fileName = file.filename;
  const basePath = `${req.protocol}://${req.get("host")}/public/uploads/`;

  const newProduct = await Product.create({
    name: req.body.name,
    description: req.body.description,
    richDescription: req.body.richDescription,
    image: `${basePath}${fileName}`, // "http://localhost:3000/public/upload/image-2323232"
    brand: req.body.brand,
    price: req.body.price,
    category: req.body.category,
    countInStock: req.body.countInStock,
    rating: req.body.rating,
    numReviews: req.body.numReviews,
    isFeatured: req.body.isFeatured,
  });
  await newProduct.save();

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

  if (!req.user.isAdmin) {
    return next(new ErrorHandler("User is not authorized", 400));
  }

  const id = req.params.id;

  const product = await Product.findByIdAndRemove({ _id: id });

  if (!product) {
    return next(new ErrorHandler("Product not found", 404));
  }

  res.status(200).json({ success: true, msg: "Successfully deleted" });
});

//get all products(filter for categories)
const getProducts = catchAsync(async (req, res, next) => {
  //http://localhost:3000/api/products?categories=123456789,987654321
  let filter = {};
  if (req.query.categories) {
    filter = { category: req.query.categories.split(",") };
  }
  const products = await Product.find(filter).populate("category");

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

  if (!req.user.isAdmin) {
    return next(new ErrorHandler("User is not authorized", 400));
  }

  if (req.body.category) {
    const findCategory = await Category.findOne({ _id: req.body.category });
    if (!findCategory) {
      return next(new ErrorHandler("Invalid category", 400));
    }
  }

  const id = req.params.id;

  const product = await Product.findByIdAndUpdate({ _id: id }, req.body, {
    new: true,
  }).populate("category");

  if (!product) {
    return next(new ErrorHandler(`No product with id ${id} found`, 404));
  }

  res.status(200).send(product);
});

//get product count
const productCount = catchAsync(async (req, res, next) => {
  if (!req.user.isAdmin) {
    return next(new ErrorHandler("User is not authorized", 400));
  }

  const count = (await Product.find({})).length;

  res.status(200).json({ count: count });
});

//get featured products
const featuredProducts = catchAsync(async (req, res, next) => {
  const count = req.params.count ? req.params.count : 0;
  const featured = await Product.find({ isFeatured: true }).limit(+count);

  res.status(200).send(featured);
});

//update product image gallery
const productImageGalleryUpdate = catchAsync(async (req, res, next) => {
  if (!mongoose.isValidObjectId(req.params.id)) {
    return next(new ErrorHandler("Invalid product ID", 400));
  }

  if (!req.user.isAdmin) {
    return next(new ErrorHandler("User is not authorized", 400));
  }

  if (req.body.category) {
    const findCategory = await Category.findOne({ _id: req.body.category });
    if (!findCategory) {
      return next(new ErrorHandler("Invalid category", 400));
    }
  }

  const id = req.params.id;

  // multer
  const files = req.files;
  let imagesPaths = [];
  const basePath = `${req.protocol}://${req.get("host")}/public/uploads/`;

  if (files) {
    files.map((file) => {
      imagesPaths.push(`${basePath}${file.filename}`);
    });
  }

  const product = await Product.findByIdAndUpdate(
    { _id: id },
    {
      images: imagesPaths,
    },
    {
      new: true,
    }
  ).populate("category");

  if (!product) {
    return next(new ErrorHandler(`No product with id ${id} found`, 404));
  }

  res.status(200).send(product);
});

module.exports = {
  createProduct,
  deleteProduct,
  getProducts,
  getProduct,
  updateProduct,
  productCount,
  featuredProducts,
  productImageGalleryUpdate,
};
