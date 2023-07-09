const express = require("express");
const router = express.Router();

const { register, getUsers, getUser, login } = require("../controllers/user");

router.route("/register").post(register);

router.route("/login").post(login);

router.route("/").get(getUsers);

router.route("/:id").get(getUser);

module.exports = router;
