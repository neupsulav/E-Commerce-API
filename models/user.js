const mongoose = require("mongoose");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");

const userSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
  },
  email: {
    type: String,
    required: true,
  },
  passwordHash: {
    type: String,
    requrired: true,
  },
  street: {
    type: String,
    default: "",
  },
  phone: {
    type: String,
    required: true,
  },
  apartment: {
    type: String,
    default: "",
  },
  city: {
    type: String,
    default: "",
  },
  zip: {
    type: String,
    default: "",
  },
  country: {
    type: String,
    default: "",
  },
  isAdmin: {
    type: Boolean,
    default: false,
  },
});

// hashing the user password
userSchema.pre("save", async function (next) {
  if (this.isModified("passwordHash")) {
    this.passwordHash = await bcrypt.hash(this.passwordHash, 10);
  }
  next();
});

//comparing user password
userSchema.methods.comparePassword = async function (passwordHash) {
  const isMatch = await bcrypt.compare(passwordHash, this.passwordHash);
  return isMatch;
};

//get jsonWebToken
userSchema.methods.getJWT = async function () {
  const token = jwt.sign(
    { userId: this._id, userName: this.name, userEmail: this.email },
    process.env.SECRET_KEY,
    { expiresIn: process.env.expiresIn }
  );
  return token;
};

module.exports = mongoose.model("User", userSchema);
