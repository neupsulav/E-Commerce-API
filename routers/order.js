const express = require("express");
const router = express.Router();
const authentication = require("../middlewares/authentication");

const {
  getOrders,
  createOrders,
  getOrder,
  updateOrder,
  deleteOrder,
  totalSales,
  orderCount,
  getUserOrders,
} = require("../controllers/order");

//routers with authentication
router.get("/", authentication, getOrders);

router.get("/:id", authentication, getOrder);

router.post("/", authentication, createOrders);

router.patch("/:id", authentication, updateOrder);

router.delete("/:id", authentication, deleteOrder);

router.get("/get/totalsales", authentication, totalSales);

router.get("/get/count", authentication, orderCount);

router.get("/get/userorder/:id", authentication, getUserOrders);

module.exports = router;
