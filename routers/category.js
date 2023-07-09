const express = require("express");
const router = express.Router();
const authentication = require("../middlewares/authentication");

const {
  createCategory,
  deleteCategory,
  getAllCategories,
  getCategory,
  updateCategory,
} = require("../controllers/category");

// routers without authentication
router.route("/").get(getAllCategories);

router.route("/:id").get(getCategory);

//routers with authentication
router.post("/", authentication, createCategory);

router.delete("/:id", authentication, deleteCategory);

router.patch("/:id", authentication, updateCategory);

module.exports = router;
