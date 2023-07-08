const express = require("express");
const router = express.Router();

const {
  createCategory,
  deleteCategory,
  getAllCategories,
  getCategory,
  updateCategory,
} = require("../controllers/category");

router.route("/").post(createCategory).get(getAllCategories);

router
  .route("/:id")
  .delete(deleteCategory)
  .get(getCategory)
  .patch(updateCategory);

module.exports = router;
