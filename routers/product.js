const express = require("express");
const router = express.Router();
const authentication = require("../middlewares/authentication");

const {
  createProduct,
  deleteProduct,
  getProducts,
  getProduct,
  updateProduct,
  productCount,
  featuredProducts,
} = require("../controllers/product");

//routers without authentication
router.route("/").get(getProducts);

router.route("/:id").get(getProduct);

router.route("/get/count").get(productCount);

router.route("/get/featured/:count").get(featuredProducts);

//routers with authentication
router.post("/", authentication, createProduct);

router.delete("/:id", authentication, deleteProduct);

router.patch("/:id", authentication, updateProduct);

module.exports = router;
