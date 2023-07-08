const express = require("express");
const router = express.Router();

const {
  createProduct,
  deleteProduct,
  getProducts,
  getProduct,
  updateProduct,
} = require("../controllers/product");

router.route("/").post(createProduct).get(getProducts);

router.route("/:id").delete(deleteProduct).get(getProduct).patch(updateProduct);

module.exports = router;
