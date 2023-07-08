const express = require("express");
const router = express.Router();

const {
  createProduct,
  deleteProduct,
  getProducts,
  getProduct,
  updateProduct,
  productCount,
  featuredProducts,
} = require("../controllers/product");

router.route("/").post(createProduct).get(getProducts);

router.route("/:id").delete(deleteProduct).get(getProduct).patch(updateProduct);

router.route("/get/count").get(productCount);

router.route("/get/featured/:count").get(featuredProducts);

module.exports = router;
