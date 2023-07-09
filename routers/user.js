const express = require("express");
const router = express.Router();
const authentication = require("../middlewares/authentication");

const {
  register,
  getUsers,
  getUser,
  login,
  userCount,
  deleteUser,
} = require("../controllers/user");

//routes without authentication
router.route("/register").post(register);

router.route("/login").post(login);

//routes with authentication
router.get("/", authentication, getUsers);

router.get("/:id", authentication, getUser);

router.get("/get/count", authentication, userCount);

router.delete("/:id", authentication, deleteUser);

module.exports = router;
