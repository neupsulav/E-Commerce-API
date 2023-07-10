const express = require("express");
const router = express.Router();
const authentication = require("../middlewares/authentication");

const {
  getOrders,
  createOrders,
  getOrder,
  updateOrder,
  deleteProduct,
} = require("../controllers/order");

//routers with authentication
router.get("/", authentication, getOrders);

router.get("/:id", authentication, getOrder);

router.post("/", authentication, createOrders);

router.patch("/:id", authentication, updateOrder);

router.delete("/:id", authentication, deleteProduct);

module.exports = router;
