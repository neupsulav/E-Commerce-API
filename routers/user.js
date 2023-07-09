const express = require("express");
const router = express.Router();
const authentication = require("../middlewares/authentication");

const { register, getUsers, getUser, login } = require("../controllers/user");

//routes without authentication
router.route("/register").post(register);

router.route("/login").post(login);

//routes with authentication
router.get("/", authentication, getUsers);

router.get("/:id", authentication, getUser);

module.exports = router;
