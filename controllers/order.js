const Order = require("../models/order");
const catchAsync = require("../middlewares/catchAsync");
const ErrorHandler = require("../middlewares/errorHandler");
const OrderItems = require("../models/order-items");
const { default: mongoose } = require("mongoose");

//get all the orders
const getOrders = catchAsync(async (req, res, next) => {
  const orders = await Order.find({})
    .populate("user", "name")
    .populate({
      path: "orderItems",
      populate: { path: "product", populate: "category" },
    })
    .sort({ dateOrdered: -1 });

  res.status(200).send(orders);
});

//get a single order
const getOrder = catchAsync(async (req, res, next) => {
  if (!mongoose.isValidObjectId(req.params.id)) {
    return next(new ErrorHandler("Invalid OrderID", 400));
  }

  const id = req.params.id;

  const order = await Order.findOne({ _id: id })
    .populate("user", "name")
    .populate({
      path: "orderItems",
      populate: { path: "product", populate: "category" },
    });

  if (!order) {
    return next(new ErrorHandler(`No order found with orderID ${id}`, 404));
  }

  res.status(200).send(order);
});

//create orders
const createOrders = catchAsync(async (req, res, next) => {
  const orderItemsIds = Promise.all(
    req.body.orderItems.map(async (orderItem) => {
      const newOrderItems = await OrderItems.create({
        quantity: orderItem.quantity,
        product: orderItem.product,
      });

      newOrderItems.save();

      return newOrderItems._id;
    })
  );

  const orderItemsResolved = await orderItemsIds;

  //calculate total price for a order
  const totalprices = await Promise.all(
    orderItemsResolved.map(async (orderItemIds) => {
      const orderItem = await OrderItems.findOne({
        _id: orderItemIds,
      }).populate("product", "price");

      const totalPrice = orderItem.product.price * orderItem.quantity;
      return totalPrice;
    })
  );

  const totalPrice = totalprices.reduce((a, b) => a + b, 0);

  const orders = await Order.create({
    orderItems: orderItemsResolved,
    shippingAddress1: req.body.shippingAddress1,
    shippingAddress2: req.body.shippingAddress2,
    city: req.body.city,
    zip: req.body.zip,
    country: req.body.country,
    phone: req.body.phone,
    status: req.body.status,
    totalPrice: totalPrice,
    user: req.body.user,
  });

  orders.save();

  res.status(201).json({ msg: "Order successfully created", orders });
});

//update a order
const updateOrder = catchAsync(async (req, res, next) => {
  if (!mongoose.isValidObjectId(req.params.id)) {
    return next(new ErrorHandler("Invalid OrderID", 400));
  }

  if (!req.user.isAdmin) {
    return next(new ErrorHandler("User is not authorized", 400));
  }

  const id = req.params.id;

  const order = await Order.findByIdAndUpdate(
    { _id: id },
    {
      status: req.body.status,
    },
    {
      new: true,
    }
  );

  if (!order) {
    return next(new ErrorHandler(`No order with id ${id} found`, 404));
  }

  res.status(200).send(order);
});

//delete a order
const deleteOrder = catchAsync(async (req, res, next) => {
  if (!mongoose.isValidObjectId(req.params.id)) {
    return next(new ErrorHandler("Invalid OrderID", 400));
  }

  if (!req.user.isAdmin) {
    return next(new ErrorHandler("User is not authorized", 400));
  }

  const id = req.params.id;

  const order = await Order.findByIdAndRemove({ _id: id });

  if (!order) {
    return next(new ErrorHandler(`Order not found with orderID ${id}`, 404));
  } else {
    order.orderItems.map(async (orderItems) => {
      await OrderItems.findByIdAndRemove(orderItems);
    });
  }

  res.status(200).json({ success: true, msg: "Successfully deleted" });
});

//get total sales
const totalSales = catchAsync(async (req, res, next) => {
  if (!req.user.isAdmin) {
    return next(new ErrorHandler("User is not authorized", 400));
  }

  const totalSale = await Order.aggregate([
    { $group: { _id: null, totalSales: { $sum: "$totalPrice" } } },
  ]);

  if (!totalSale) {
    return next(new ErrorHandler("Couldn't get totalsales", 400));
  }

  res.status(200).send({ totalsales: totalSale.pop().totalSales });
});

//get order count
const orderCount = catchAsync(async (req, res, next) => {
  if (!req.user.isAdmin) {
    return next(new ErrorHandler("User is not authorized", 400));
  }

  const count = (await Order.find({})).length;

  res.status(200).json({ count: count });
});

//get user orders
const getUserOrders = catchAsync(async (req, res, next) => {
  if (!mongoose.isValidObjectId(req.params.id)) {
    return next(new ErrorHandler("Invalid User ID", 400));
  }

  const userOrdersList = await Order.find({ user: req.params.id })
    .populate({
      path: "orderItems",
      populate: { path: "product", populate: "category" },
    })
    .sort({ dateOrdered: -1 });

  if (!userOrdersList) {
    return next(new ErrorHandler("User order list couldn't be retrieved", 400));
  }

  res.status(200).send(userOrdersList);
});

module.exports = {
  getOrders,
  createOrders,
  getOrder,
  updateOrder,
  deleteOrder,
  totalSales,
  orderCount,
  getUserOrders,
};
